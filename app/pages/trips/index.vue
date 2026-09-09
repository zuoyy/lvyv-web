<template>
  <AccountPageShell
    active-page="trips"
    title="My trips"
    description="Find every itinerary prepared for you, including the latest veersion and daily plan"
    :ready="ready"
  >
    <div class="trip-toolbar">
      <div class="filter-tabs" role="group" aria-label="Trip status">
        <button
          v-for="filter in filters"
          :key="filter.value"
          type="button"
          :class="{ active: activeFilter === filter.value }"
          @click="activeFilter = filter.value"
        >
          {{ filter.label }}
        </button>
      </div>
    </div>

    <div v-if="loading" class="content-state" role="status"><span class="state-spinner" />Building your trip list...</div>
    <div v-else-if="loadError" class="content-state error-state">
      <font-awesome-icon :icon="['fas', 'circle-exclamation']" />
      <strong>We could not load your trips.</strong><span>{{ loadError }}</span>
      <button type="button" @click="fetchTrips">Try again</button>
    </div>
    <div v-else-if="!filteredTrips.length" class="content-state empty-state">
      <div class="empty-symbol"><font-awesome-icon :icon="['fas', 'route']" /></div>
      <strong>{{ trips.length ? 'No trips match this filter' : 'No itineraries yet' }}</strong>
      <span>{{ trips.length ? 'Choose another view to see your trips.' : 'When a travel designer delivers your first itinerary, it will appear here.' }}</span>
      <NuxtLink v-if="!trips.length" to="/wish/my">View my wishes</NuxtLink>
    </div>

    <div v-else class="trip-list">
      <article v-for="trip in filteredTrips" :key="trip.itineraryNo" class="trip-card">
        <!-- 顶部信息栏：编号、时间、状态 -->
        <div class="trip-card__header">
          <div class="trip-card__meta">
            <span class="trip-card__no">{{ trip.itineraryNo }}</span>
            <span class="trip-card__divider" aria-hidden="true" />
            <span class="trip-card__time">Order Time: {{ formatTripDate(trip.createTime) }}</span>
          </div>
          <span class="trip-card__status" :class="tripStatusClass(trip.status)">{{ trip.statusName }}</span>
        </div>

        <div class="trip-card__sep" aria-hidden="true" />

        <!-- 主体信息：左侧封面 + 右侧详情 -->
        <div class="trip-card__main">
          <div class="trip-card__media">
            <img
              :src="trip.imageUrls[0] || '/images/profile/trip-sample-cover.webp'"
              :alt="trip.cityLabel || trip.title"
              loading="lazy"
            >
          </div>

          <div class="trip-card__content">
            <h2 class="trip-card__title">{{ trip.title || `${trip.cityLabel} journey` }}</h2>
            <p class="trip-card__summary">{{ trip.summary || 'Xi\'an isn\'t a city that belongs only to the past-it\'s a place where history is still part of everyday life. Over four days, this Encounter...' }}</p>

            <!-- 渐变属性条 -->
            <div class="trip-card__specs">
              <div class="trip-spec-item">
                <span class="trip-spec-icon icon-pin" aria-hidden="true" />
                <span>{{ trip.cityLabel || 'China' }}</span>
              </div>
              <div class="trip-spec-item">
                <span class="trip-spec-icon icon-calendar" aria-hidden="true" />
                <span>{{ trip.startDate ? `${trip.startDate}${trip.endDate ? ` - ${trip.endDate}` : ''}` : (trip.dateText || `${trip.dayCount} day plan`) }}</span>
              </div>
              <div class="trip-spec-item">
                <span class="trip-spec-icon icon-users" aria-hidden="true" />
                <span>{{ trip.travelerCount ? `${trip.travelerCount} traveler${trip.travelerCount > 1 ? 's' : ''}` : '2 travelers' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 底部操作栏：查看行程与报价彻底解耦 -->
        <div class="trip-card__actions">
          <button v-if="canDeleteTrip(trip)" type="button" class="btn-trip-delete" @click="handleDeleteTrip(trip)">Delete</button>
          <!-- 查看行程：单纯就是查看行程 -->
          <button type="button" class="btn-trip-plan" @click="openPlan(trip)">View Plan</button>
          <!-- 独立报价按钮：查看当前报价与历史方案 -->
          <button
            v-if="trip.offerCount"
            type="button"
            :class="trip.pendingOffer ? 'btn-trip-offer-primary' : 'btn-trip-offer-secondary'"
            @click="handleOfferClick(trip)"
          >
            {{ trip.pendingOffer ? 'Review Offer' : `Offers (${trip.offerCount})` }}
          </button>
          <!-- 待支付订单快捷入口 -->
          <button
            v-if="trip.status === 'WAITING_PAYMENT' && trip.orderNo"
            type="button"
            class="btn-trip-pay"
            @click="navigateTo(`/orders/${encodeURIComponent(trip.orderNo)}/pay`)"
          >
            Pay Order
          </button>
        </div>
      </article>
    </div>

    <!-- 查看行程弹窗：单纯纯粹展示行程规划与景点路线 -->
    <div v-if="offersError" class="content-state error-state"><span>{{ offersError }}</span><button type="button" @click="fetchSummaries(trips, listRequest)">Retry offers</button></div>
    <AccountPagination :page="currentPage" :size="10" :total="total" :loading="loading" @change="changePage" />
    <Teleport to="body">
      <div v-if="selectedTrip" class="modal-backdrop" @click.self="closePlan">
        <section class="trip-modal" role="dialog" aria-modal="true" aria-labelledby="trip-plan-title">
          <header>
            <div><p>{{ selectedTrip.cityLabel }} · Version {{ selectedTrip.versionNo }}</p><h2 id="trip-plan-title">{{ selectedTrip.title }}</h2></div>
            <button type="button" aria-label="Close" @click="closePlan">×</button>
          </header>
          <div v-if="planLoading" class="content-state" role="status">Loading itinerary...</div>
          <div v-else-if="planError" class="content-state error-state"><span>{{ planError }}</span><button type="button" @click="openPlan(selectedTrip)">Try again</button></div>
          <p v-if="!planLoading && !planError && selectedTrip.summary" class="modal-summary">{{ selectedTrip.summary }}</p>
          <div v-if="!planLoading && !planError && selectedTrip.days.length" class="day-list">
            <section v-for="day in selectedTrip.days" :key="day.id" class="day-section">
              <div class="day-number">Day {{ day.dayNo }}</div>
              <div class="day-content">
                <h3>{{ day.title }}</h3><p v-if="day.summary">{{ day.summary }}</p>
                <ol v-if="day.items?.length">
                  <li v-for="item in day.items" :key="item.id">
                    <span>{{ item.projectTypeLabel || 'Experience' }}</span>
                    <strong>{{ item.title }}</strong>
                    <p v-if="item.address">{{ item.address }}</p>
                    <dl v-if="item.tagGroups.length" class="item-tag-groups">
                      <div v-for="group in item.tagGroups" :key="group.code"><dt>{{ group.label }}</dt><dd>{{ group.tags.map(tag => tag.label).join(' · ') }}</dd></div>
                    </dl>
                  </li>
                </ol>
              </div>
            </section>
          </div>
          <div v-else class="no-days">The detailed day plan is being prepared.</div>
          <footer>
            <button type="button" class="btn-trip-close-modal" @click="closePlan">Close</button>
          </footer>
        </section>
      </div>
    </Teleport>

    <!-- 独立弹窗：方案报价与历史记录（Offers & History） -->
    <Teleport to="body">
      <div v-if="selectedOfferTrip" class="modal-backdrop" @click.self="closeHistory">
        <section class="trip-modal offer-history-modal" role="dialog" aria-modal="true" aria-labelledby="offer-history-title">
          <header>
            <div>
              <p>Quotations & History · {{ selectedOfferTrip.sourceLabel }}</p>
              <h2 id="offer-history-title">{{ selectedOfferTrip.title }}</h2>
            </div>
            <button type="button" aria-label="Close" @click="closeHistory">×</button>
          </header>

          <div v-if="historyLoading" class="content-state" role="status">Loading offers...</div>
          <div v-else-if="historyError" class="content-state error-state"><span>{{ historyError }}</span><button type="button" @click="openOffers(selectedOfferTrip, historyPage)">Try again</button></div>
          <div v-else-if="!selectedOfferTrip.offers.length" class="content-state">No offers yet.</div>
          <div v-else class="offer-modal-body">
            <p class="offer-modal-subtitle">
              Below are all quotation proposals and historical adjustments prepared by your travel designer for this trip.
            </p>

            <div class="offer-timeline">
              <article
                v-for="(offer, idx) in selectedOfferTrip.offers"
                :key="offer.id || offer.offerNo"
                class="offer-history-card"
                :class="{ 'offer-history-card--active': offer.status === 'SENT' }"
              >
                <div class="offer-history-card__top">
                  <div class="offer-history-card__meta">
                    <span class="offer-status-badge" :class="`offer-status-badge--${offer.status.toLowerCase()}`">
                      {{ formatOfferStatus(offer.status) }}
                    </span>
                    <strong class="offer-no-code">{{ offer.offerNo }}</strong>
                    <span v-if="idx === 0 && offer.status === 'SENT'" class="offer-latest-pill">Latest</span>
                  </div>
                  <time class="offer-create-time">{{ formatDateTime(offer.createTime) }}</time>
                </div>

                <div v-if="offer.tiers?.length" class="offer-history-card__tiers">
                  <div class="tier-label">Tiered Pricing</div>
                  <div class="tier-list">
                    <div v-for="tier in offer.tiers" :key="tier.id" class="tier-item">
                      <span class="tier-pax">{{ tier.minTravelerCount }}{{ tier.maxTravelerCount == null ? '+' : `-${tier.maxTravelerCount}` }} travelers:</span>
                      <span class="tier-price">Adult <strong>{{ offer.currency }} {{ Number(tier.adultSalePrice).toFixed(2) }}</strong></span>
                      <span class="tier-price-sep">·</span>
                      <span class="tier-price">Child <strong>{{ offer.currency }} {{ Number(tier.childSalePrice).toFixed(2) }}</strong></span>
                    </div>
                  </div>
                </div>

                <div v-if="offer.validUntil" class="offer-validity-info">
                  <span>Validity: until {{ formatDateTime(offer.validUntil) }}</span>
                </div>

                <div v-if="offer.status === 'SENT' || offer.status !== 'ACCEPTED'" class="offer-history-card__action">
                  <button
                    v-if="offer.status === 'SENT'"
                    type="button"
                    class="btn-offer-review-main"
                    @click="openConfirmOffer(selectedOfferTrip, offer)"
                  >
                    Review & Confirm Offer
                  </button>
                  <button
                    v-else-if="offer.status !== 'ACCEPTED'"
                    type="button"
                    class="btn-offer-view-snapshot"
                    @click="openOfferSnapshot(offer)"
                  >
                    View Proposal Snapshot
                  </button>
                </div>
              </article>
            </div>
          </div>

          <footer>
            <AccountPagination :page="historyPage" :size="10" :total="historyTotal" :loading="historyLoading" @change="openOffers(selectedOfferTrip, $event)" />
            <button type="button" class="btn-trip-close-modal" @click="closeHistory">Close</button>
          </footer>
        </section>
      </div>
    </Teleport>

    <!-- 原地轻量查看：方案与报价快照弹窗（无需跳页） -->
    <Teleport to="body">
      <div v-if="snapshotOffer" class="modal-backdrop" style="z-index: 1600;" @click.self="closeSnapshot">
        <section class="trip-modal snapshot-modal" role="dialog" aria-modal="true" aria-labelledby="snapshot-modal-title">
          <header>
            <div>
              <p>Proposal Snapshot · {{ snapshotOffer.offerNo }}</p>
              <h2 id="snapshot-modal-title">{{ snapshotDetail?.itinerary?.content?.content?.title || snapshotOffer.offerNo }}</h2>
            </div>
            <button type="button" aria-label="Close" @click="closeSnapshot">×</button>
          </header>

          <div v-if="snapshotLoading" class="snapshot-loading">
            <span class="state-spinner" />
            <span>Loading quotation snapshot...</span>
          </div>
          <div v-else-if="snapshotError" class="snapshot-error">
            <span>{{ snapshotError }}</span>
          </div>
          <div v-else class="snapshot-modal-body">
            <!-- 状态与版本条 -->
            <div class="snapshot-status-bar">
              <span class="offer-status-badge" :class="`offer-status-badge--${snapshotOffer.status.toLowerCase()}`">
                {{ formatOfferStatus(snapshotOffer.status) }}
              </span>
              <span v-if="snapshotDetail?.itinerary?.versionNo" class="snapshot-version-tag">
                Version V{{ snapshotDetail.itinerary.versionNo }}
              </span>
              <span v-if="snapshotOffer.validUntil" class="snapshot-validity-text">
                Valid until {{ formatDateTime(snapshotOffer.validUntil) }}
              </span>
            </div>

            <!-- 定制师留言 -->
            <div v-if="snapshotDetail?.itinerary?.content?.content?.designerMessage" class="snapshot-message-box">
              <div class="snapshot-message-label">Designer's Note</div>
              <p>{{ snapshotDetail.itinerary.content.content.designerMessage }}</p>
            </div>

            <!-- 价格阶梯快照 -->
            <div class="snapshot-section">
              <h3 class="snapshot-section-title">Price Tiers & Quotation</h3>
              <div class="snapshot-tiers-table">
                <div class="snapshot-tier-header">
                  <span>Travelers Group</span>
                  <span>Adult Unit Price</span>
                  <span>Child Unit Price</span>
                </div>
                <div v-for="tier in (snapshotOffer.tiers || [])" :key="tier.id" class="snapshot-tier-row">
                  <span>{{ tier.minTravelerCount }}{{ tier.maxTravelerCount == null ? '+' : ` - ${tier.maxTravelerCount}` }} travelers</span>
                  <strong>{{ snapshotOffer.currency }} {{ Number(tier.adultSalePrice).toFixed(2) }}</strong>
                  <strong>{{ snapshotOffer.currency }} {{ Number(tier.childSalePrice).toFixed(2) }}</strong>
                </div>
              </div>
            </div>

            <!-- 历史版本完整详细行程规划展示 -->
            <div v-if="snapshotDetail?.itinerary?.content?.days?.length" class="snapshot-section">
              <h3 class="snapshot-section-title">Historical Itinerary Plan ({{ snapshotDetail.itinerary.content.days.length }} Days)</h3>
              <div class="snapshot-day-list">
                <section v-for="day in snapshotDetail.itinerary.content.days" :key="day.id" class="snapshot-day-section">
                  <div class="snapshot-day-number">Day {{ day.dayNo }}</div>
                  <div class="snapshot-day-content">
                    <h4>{{ day.title }}</h4>
                    <p v-if="day.summary" class="snapshot-day-summary">{{ day.summary }}</p>
                    <ol v-if="getSnapshotDayItems(day.id).length" class="snapshot-item-list">
                      <li v-for="item in getSnapshotDayItems(day.id)" :key="item.id">
                        <span class="snapshot-item-type">{{ item.projectType || 'Experience' }}</span>
                        <strong>{{ item.title }}</strong>
                        <p v-if="item.address" class="snapshot-item-addr">{{ item.address }}</p>
                        <dl v-if="item.tagGroups?.length" class="item-tag-groups">
                          <div v-for="group in item.tagGroups" :key="group.code">
                            <dt>{{ group.label }}</dt>
                            <dd>{{ group.tags.map(tag => tag.label).join(' · ') }}</dd>
                          </div>
                        </dl>
                      </li>
                    </ol>
                  </div>
                </section>
              </div>
            </div>
          </div>

          <footer>
            <button type="button" class="btn-trip-close-modal" @click="closeSnapshot">Close</button>
          </footer>
        </section>
      </div>
    </Teleport>

    <!-- 待确认报价方案弹窗：直接在当前行程页完成人数核对、积分抵扣与确认成单（无需跳页） -->
    <Teleport to="body">
      <div v-if="confirmModalOffer && confirmModalTrip" class="modal-backdrop" style="z-index: 1550;" @click.self="closeConfirmOffer">
        <section class="trip-modal confirm-offer-modal" role="dialog" aria-modal="true" aria-labelledby="confirm-modal-title">
          <header>
            <div>
              <p>Quotation & Booking Details · {{ confirmModalOffer.offerNo }}</p>
              <h2 id="confirm-modal-title">{{ confirmation?.itinerary?.content?.content?.title || confirmModalTrip.title }}</h2>
            </div>
            <button type="button" aria-label="Close" @click="closeConfirmOffer">×</button>
          </header>

          <div v-if="confirmLoading" class="content-state" role="status">
            <span class="state-spinner" />
            <span>Loading quotation details...</span>
          </div>
          <div v-else-if="confirmError" class="content-state error-state">
            <span>{{ confirmError }}</span>
            <button type="button" @click="openConfirmOffer(confirmModalTrip, confirmModalOffer)">Try again</button>
          </div>
          <div v-else-if="confirmation" class="confirm-offer-body">
            <!-- 左侧：参数与人数配置 -->
            <div class="confirm-left-panel">
              <!-- 行程简况与日期 -->
              <div class="confirm-summary-box">
                <div class="confirm-date-row">
                  <span class="trip-spec-icon icon-calendar" aria-hidden="true" />
                  <span>Departure: <strong>{{ formatDate(confirmation.itinerary.startDate) }} - {{ formatDate(confirmation.itinerary.endDate) }}</strong></span>
                </div>
                <p v-if="confirmation.itinerary.content?.content?.summary" class="confirm-summary-text">
                  {{ confirmation.itinerary.content.content.summary }}
                </p>
              </div>

              <!-- 定制师留言 -->
              <div v-if="confirmation.itinerary.content?.content?.designerMessage" class="confirm-designer-note">
                <div class="confirm-note-label">Designer's Note</div>
                <p>{{ confirmation.itinerary.content.content.designerMessage }}</p>
              </div>

              <!-- 阶梯价格说明 -->
              <div class="confirm-tier-summary">
                <div class="confirm-section-label">Pricing Tiers</div>
                <div class="confirm-tier-pills">
                  <div v-for="tier in (confirmModalOffer.tiers || [])" :key="tier.id" class="confirm-tier-pill">
                    <span class="tier-range">{{ tier.minTravelerCount }}{{ tier.maxTravelerCount == null ? '+' : `-${tier.maxTravelerCount}` }} travelers:</span>
                    <span class="tier-val">Adult <strong>{{ confirmModalOffer.currency }} {{ Number(tier.adultSalePrice).toFixed(0) }}</strong> / Child <strong>{{ confirmModalOffer.currency }} {{ Number(tier.childSalePrice).toFixed(0) }}</strong></span>
                  </div>
                </div>
              </div>

              <!-- 出行人数配置 -->
              <div class="confirm-travelers-form">
                <div class="confirm-section-label">Select Travelers</div>
                <div class="travelers-input-grid">
                  <div class="traveler-field">
                    <label for="modal-adult-count">Adults (Age 12+)</label>
                    <div class="counter-input-wrap">
                      <button type="button" class="btn-counter" :disabled="adultCount <= 1 || confirmSubmitting" @click="adultCount = Math.max(1, adultCount - 1)">-</button>
                      <input id="modal-adult-count" v-model.number="adultCount" type="number" min="1" step="1" inputmode="numeric" :disabled="confirmSubmitting">
                      <button type="button" class="btn-counter" :disabled="confirmSubmitting" @click="adultCount = adultCount + 1">+</button>
                    </div>
                  </div>
                  <div class="traveler-field">
                    <label for="modal-child-count">Children (Under 12)</label>
                    <div class="counter-input-wrap">
                      <button type="button" class="btn-counter" :disabled="childCount <= 0 || confirmSubmitting" @click="childCount = Math.max(0, childCount - 1)">-</button>
                      <input id="modal-child-count" v-model.number="childCount" type="number" min="0" step="1" inputmode="numeric" :disabled="confirmSubmitting">
                      <button type="button" class="btn-counter" :disabled="confirmSubmitting" @click="childCount = childCount + 1">+</button>
                    </div>
                  </div>
                </div>
                <div v-if="travelerValidationMessage || quoteError" class="traveler-error-text">
                  {{ travelerValidationMessage || quoteError }}
                </div>
              </div>

              <!-- 积分抵扣 -->
              <div v-if="availablePoints > 0" class="confirm-points-form">
                <div class="confirm-section-label">Points Redemption</div>
                <div class="points-field-row">
                  <input id="modal-offer-points" v-model.number="requestedPoints" class="points-input" type="number" min="0" :max="availablePoints" step="1" placeholder="0">
                  <button type="button" class="btn-use-all-points" @click="requestedPoints = availablePoints">
                    Use all {{ availablePoints }} pts
                  </button>
                </div>
                <span class="points-tip">Available: {{ availablePoints }} points ({{ pointsPerUsd }} pts = $1.00 USD)</span>
              </div>
            </div>

            <!-- 右侧：账单明细卡片与提交区 -->
            <div class="confirm-right-panel">
              <div class="confirm-bill-card">
                <h3 class="bill-card-title">Quotation Summary</h3>
                <div v-if="quoteLoading" class="bill-loading">Calculating pricing...</div>
                <div v-else-if="quote" class="bill-breakdown">
                  <div class="bill-row">
                    <span>Adults ({{ quote.adultCount }} × {{ formatMoney(quote.adultSaleUnitPrice) }})</span>
                    <strong>{{ formatMoney(quote.adultSubtotal) }}</strong>
                  </div>
                  <div v-if="quote.childCount" class="bill-row">
                    <span>Children ({{ quote.childCount }} × {{ formatMoney(quote.childSaleUnitPrice) }})</span>
                    <strong>{{ formatMoney(quote.childSubtotal) }}</strong>
                  </div>
                  <div class="bill-row">
                    <span>List subtotal</span>
                    <span>{{ formatMoney(quote.listSubtotal) }}</span>
                  </div>
                  <div v-if="Number(quote.discountAmount) > 0" class="bill-row discount-row">
                    <span>Tier discount</span>
                    <span>-{{ formatMoney(quote.discountAmount) }}</span>
                  </div>
                  <div v-if="Number(quote.redemption?.pointsAmount || 0) > 0" class="bill-row discount-row">
                    <span>Points ({{ quote.redemption?.usablePoints }} pts)</span>
                    <span>-{{ formatMoney(quote.redemption?.pointsAmount || 0) }}</span>
                  </div>
                  <div class="bill-divider" />
                  <div class="bill-row total-row">
                    <span>Total to Pay</span>
                    <span class="total-amount">{{ formatMoney(quote.totalAmount) }}</span>
                  </div>
                </div>

                <div v-if="confirmModalOffer.validUntil" class="bill-validity">
                  <span>Validity: until <strong>{{ formatDateTime(confirmModalOffer.validUntil) }}</strong></span>
                </div>

                <div class="bill-actions">
                  <button
                    type="button"
                    class="btn-confirm-submit"
                    :disabled="confirmSubmitting || quoteLoading || !travelerCountsValid || !quote"
                    @click="submitConfirmOffer"
                  >
                    {{ confirmSubmitting ? 'Creating order...' : 'Confirm Offer & View in Orders' }}
                  </button>
                  <button
                    v-if="confirmation.canRequestRevision"
                    type="button"
                    class="btn-confirm-revision"
                    @click="revisionOpen = !revisionOpen"
                  >
                    {{ revisionOpen ? 'Cancel Revision' : 'Request a Revision' }}
                  </button>
                </div>

                <!-- 申请调整需求面板 -->
                <div v-if="revisionOpen" class="revision-drawer">
                  <label for="modal-revision-input">Describe needed adjustments:</label>
                  <textarea
                    id="modal-revision-input"
                    v-model="revisionContent"
                    rows="4"
                    placeholder="E.g., Adjust day 3 hotel, add 1 more museum..."
                  />
                  <div class="revision-drawer-actions">
                    <button
                      type="button"
                      class="btn-send-revision"
                      :disabled="revisionSubmitting || !revisionContent.trim()"
                      @click="submitRevision"
                    >
                      {{ revisionSubmitting ? 'Sending...' : 'Submit Request' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <footer>
            <button type="button" class="btn-trip-close-modal" @click="closeConfirmOffer">Close</button>
          </footer>
        </section>
      </div>
    </Teleport>
  </AccountPageShell>
</template>

<script setup lang="ts">
import AccountPageShell from '~/components/profile/AccountPageShell.vue'
import AccountPagination from '~/components/profile/AccountPagination.vue'
import type { ItinerarySummary, ItineraryInstance, CustomOfferView } from '~/composables/useTourCommerce'

useNoIndex()

interface TripItemDetail { id: number; projectTypeLabel?: string; title: string; address?: string; tagGroups: import('~/composables/useTourCommerce').ItineraryTagGroupView[] }
interface TripDay { id: number; dayNo: number; title: string; summary?: string; items: TripItemDetail[] }
interface Trip {
  id: number; dayCount: number; offerCount: number
  itineraryNo: string; itineraryType: 'STANDARD_PURCHASE' | 'CUSTOM_SERVICE'; sourceType: 'STANDARD_PRODUCT' | 'WISH' | 'MANUAL'; wishId?: number; wishNo?: string; orderNo?: string; status: string; statusName: string; versionNo: number; travelerCount?: number; startDate?: string; endDate?: string
  itineraryTypeLabel: string; sourceLabel: string; title: string; cityLabel: string; imageUrls: string[]; dateText?: string
  summary?: string; designerMessage?: string; days: TripDay[]; createTime?: string
  customItineraryId?: number
  offers: import('~/composables/useTourCommerce').CustomOfferView[]
  latestOffer?: import('~/composables/useTourCommerce').CustomOfferView
  pendingOffer?: import('~/composables/useTourCommerce').CustomOfferView
}

const { auth, ready, initializeAccount } = useAccountPage('/trips')
const route = useRoute()
const commerce = useTourCommerce()
const trips = ref<Trip[]>([])
const loading = ref(false)
const loadError = ref('')
const currentPage = ref(1)
const total = ref(0)
const planLoading = ref(false)
const planError = ref('')
const historyLoading = ref(false)
const historyError = ref('')
const historyPage = ref(1)
const historyTotal = ref(0)
const offersError = ref('')
let listRequest = 0
let planRequest = 0
let historyRequest = 0
let snapshotRequest = 0
const selectedTrip = ref<Trip | null>(null)
const selectedOfferTrip = ref<Trip | null>(null)
const snapshotOffer = ref<import('~/composables/useTourCommerce').CustomOfferView | null>(null)
const snapshotDetail = ref<import('~/composables/useTourCommerce').CustomOfferConfirmationView | null>(null)
const snapshotLoading = ref(false)
const snapshotError = ref('')

// 待确认报价方案弹窗状态与方法
const confirmModalTrip = ref<Trip | null>(null)
const confirmModalOffer = ref<import('~/composables/useTourCommerce').CustomOfferView | null>(null)
const confirmation = ref<import('~/composables/useTourCommerce').CustomOfferConfirmationView | null>(null)
const confirmLoading = ref(false)
const confirmSubmitting = ref(false)
const confirmError = ref('')
const adultCount = ref(1)
const childCount = ref(0)
const requestedPoints = ref(0)
const availablePoints = ref(0)
const pointsPerUsd = ref(100)
const maxTravelerCount = 2_147_483_647

const quote = ref<import('~/composables/useTourCommerce').CustomOfferQuote | null>(null)
const quoteLoading = ref(false)
const quoteError = ref('')
let quoteRequest = 0
let quoteTimer: ReturnType<typeof setTimeout> | undefined

const revisionOpen = ref(false)
const revisionContent = ref('')
const revisionSubmitting = ref(false)

const travelerCountsValid = computed(() =>
  Number.isInteger(adultCount.value) && adultCount.value >= 1
  && Number.isInteger(childCount.value) && childCount.value >= 0
  && adultCount.value <= maxTravelerCount - childCount.value
)
const travelerValidationMessage = computed(() =>
  travelerCountsValid.value ? '' : 'Enter whole numbers: at least 1 adult and 0 or more children.'
)

const formatMoney = (amount: string | number) => `${confirmModalOffer.value?.currency || 'USD'} ${Number(amount).toFixed(2)}`
const formatDate = (value?: string) => {
  if (!value) return 'Not set'
  const [yearText, monthText, dayText] = value.split('-')
  if (!yearText || !monthText || !dayText) return value
  const year = Number(yearText)
  const month = Number(monthText)
  const day = Number(dayText)
  if (![year, month, day].every(Number.isInteger)) return value
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(year, month - 1, day))
}

const refreshQuote = async () => {
  const offerNo = confirmModalOffer.value?.offerNo
  if (!offerNo) return
  const request = ++quoteRequest
  quote.value = null
  quoteError.value = ''
  if (!travelerCountsValid.value) {
    quoteLoading.value = false
    return
  }
  quoteLoading.value = true
  try {
    const result = await commerce.previewOffer(offerNo, adultCount.value, childCount.value, requestedPoints.value)
    if (request === quoteRequest) quote.value = result
  } catch (caught) {
    if (request === quoteRequest) quoteError.value = caught instanceof Error ? caught.message : 'This traveler count is not available for the offer.'
  } finally {
    if (request === quoteRequest) quoteLoading.value = false
  }
}

const openConfirmOffer = async (trip: Trip, offer: import('~/composables/useTourCommerce').CustomOfferView) => {
  confirmModalTrip.value = trip
  confirmModalOffer.value = offer
  confirmLoading.value = true
  confirmError.value = ''
  revisionOpen.value = false
  revisionContent.value = ''
  quote.value = null
  try {
    const [result, account, config] = await Promise.all([
      commerce.getOffer(offer.offerNo),
      commerce.getPointsAccount(),
      commerce.getPointsRedemptionConfig()
    ])
    confirmation.value = result
    availablePoints.value = account.availablePoints || 0
    pointsPerUsd.value = config.pointsPerUsd || 100
    requestedPoints.value = 0

    const adults = Number(result.itinerary?.adultCount || trip.travelerCount || 1)
    const children = Number(result.itinerary?.childCount || 0)
    adultCount.value = adults >= 1 ? adults : 1
    childCount.value = children >= 0 ? children : 0

    await refreshQuote()
  } catch (err) {
    confirmError.value = err instanceof Error ? err.message : 'Could not load quotation details.'
  } finally {
    confirmLoading.value = false
  }
}

const closeConfirmOffer = () => {
  ++quoteRequest
  if (quoteTimer) clearTimeout(quoteTimer)
  confirmModalTrip.value = null
  confirmModalOffer.value = null
  confirmation.value = null
  revisionOpen.value = false
}

const submitConfirmOffer = async () => {
  if (confirmSubmitting.value || !confirmModalOffer.value) return
  if (!travelerCountsValid.value || !quote.value) {
    quoteError.value = travelerValidationMessage.value || 'Please select valid traveler counts.'
    return
  }
  confirmSubmitting.value = true
  confirmError.value = ''
  try {
    await commerce.confirmOffer(
      confirmModalOffer.value.offerNo,
      adultCount.value,
      childCount.value,
      requestedPoints.value
    )
    closeConfirmOffer()
    await navigateTo('/orders')
  } catch (caught) {
    confirmError.value = caught instanceof Error ? caught.message : 'Could not confirm this offer.'
  } finally {
    confirmSubmitting.value = false
  }
}

const submitRevision = async () => {
  if (revisionSubmitting.value || !confirmModalOffer.value || !revisionContent.value.trim()) return
  revisionSubmitting.value = true
  confirmError.value = ''
  try {
    await commerce.requestRevision(confirmModalOffer.value.offerNo, revisionContent.value.trim())
    revisionOpen.value = false
    closeConfirmOffer()
    await fetchTrips()
  } catch (caught) {
    confirmError.value = caught instanceof Error ? caught.message : 'Could not send revision request.'
  } finally {
    revisionSubmitting.value = false
  }
}

const handleOfferClick = (trip: Trip) => {
  if (trip.pendingOffer) {
    openConfirmOffer(trip, trip.pendingOffer)
  } else {
    openOffers(trip)
  }
}

watch([adultCount, childCount, requestedPoints], () => {
  if (confirmModalOffer.value && !confirmLoading.value) {
    ++quoteRequest
    quote.value = null
    quoteLoading.value = true
    if (quoteTimer) clearTimeout(quoteTimer)
    quoteTimer = setTimeout(() => void refreshQuote(), 250)
  }
})

onBeforeUnmount(() => {
  if (quoteTimer) clearTimeout(quoteTimer)
})

const openOfferSnapshot = async (offer: import('~/composables/useTourCommerce').CustomOfferView) => {
  const request = ++snapshotRequest
  snapshotOffer.value = offer
  snapshotDetail.value = null
  snapshotLoading.value = true
  snapshotError.value = ''
  try {
    const result = await commerce.getOffer(offer.offerNo)
    if (request === snapshotRequest) snapshotDetail.value = result
  } catch (err) {
    if (request === snapshotRequest) snapshotError.value = err instanceof Error ? err.message : 'Failed to load offer snapshot.'
  } finally {
    if (request === snapshotRequest) snapshotLoading.value = false
  }
}

const getSnapshotDayItems = (dayId: number) => {
  const items = snapshotDetail.value?.itinerary?.content?.items || []
  return items.filter(item => item.dayId === dayId).map(item => ({
    ...item,
    tagGroups: parseTagGroups(item.tagGroups)
  }))
}

const activeFilter = ref<'all' | 'ready' | 'revision' | 'closed'>('all')
const filters = [{ value: 'all' as const, label: 'All' }, { value: 'ready' as const, label: 'Ready' }, { value: 'revision' as const, label: 'In revision' }, { value: 'closed' as const, label: 'Past' }]

const parseTagGroups = (value: string | import('~/composables/useTourCommerce').ItineraryTagGroupSnapshot[] | undefined) => {
  let groups: import('~/composables/useTourCommerce').ItineraryTagGroupSnapshot[] = []
  if (Array.isArray(value)) groups = value
  else if (typeof value === 'string' && value.trim()) {
    try { const parsed = JSON.parse(value); if (Array.isArray(parsed)) groups = parsed } catch { groups = [] }
  }
  return groups.filter(group => group.showOnItinerary).sort((a, b) => a.groupSort - b.groupSort).map(group => ({
    code: group.groupCode,
    label: group.groupLabels?.['en-US'] || group.groupCode,
    sort: group.groupSort,
    tags: [...(group.tags || [])].sort((a, b) => a.sort - b.sort).map(tag => ({ sourceTagId: tag.sourceTagId, code: tag.code, label: tag.labels?.['en-US'] || tag.code, sort: tag.sort }))
  }))
}

const filteredTrips = computed(() => trips.value)

const formatTripDate = (dateStr?: string) => {
  if (!dateStr) return '2026-01-06 11:50:53'
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    const pad = (n: number) => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
  } catch {
    return dateStr
  }
}

const formatDateTime = (dateStr?: string) => {
  if (!dateStr) return '-'
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    return d.toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  } catch {
    return dateStr
  }
}

const formatOfferStatus = (status: string) => {
  const map: Record<string, string> = {
    SENT: 'Awaiting confirmation',
    ACCEPTED: 'Accepted & Ordered',
    REVISION_REQUESTED: 'Revision requested',
    EXPIRED: 'Expired',
    CANCELLED: 'Cancelled'
  }
  return map[status] || status
}

const canDeleteTrip = (trip: Trip) => ['CANCELLED', 'CLOSED', 'FINISHED'].includes(trip.status)

const handleDeleteTrip = (trip: Trip) => {
  if (confirm('Are you sure you want to remove this trip?')) {
    trips.value = trips.value.filter(t => t.itineraryNo !== trip.itineraryNo)
  }
}

const toTrip = (instance: ItineraryInstance | ItinerarySummary): Trip => {
  const content = 'content' in instance ? instance.content?.content : undefined
  const days = 'content' in instance ? instance.content?.days || [] : []
  const items = 'content' in instance ? instance.content?.items || [] : []
  const summary = instance as ItinerarySummary
  return {
    id: instance.id, itineraryNo: instance.itineraryNo, itineraryType: instance.itineraryType,
    sourceType: instance.sourceType, customItineraryId: instance.customItineraryId,
    wishId: instance.wishId, wishNo: instance.wishNo, orderNo: instance.orderNo,
    offers: [], offerCount: 0, dayCount: summary.dayCount ?? days.length,
    status: instance.status, statusName: instance.statusName, versionNo: instance.versionNo || 1,
    itineraryTypeLabel: instance.itineraryType === 'STANDARD_PURCHASE' ? 'Featured journey' : 'Custom itinerary',
    sourceLabel: instance.sourceType === 'STANDARD_PRODUCT' ? 'Featured journey purchase'
      : instance.sourceType === 'WISH' ? `Wish customization${instance.wishNo ? ` · ${instance.wishNo}` : ''}` : 'Concierge customization',
    title: content?.title || instance.title, cityLabel: instance.cityLabel || instance.cityCode || '',
    imageUrls: instance.imageUrls || [], travelerCount: instance.travelerCount,
    startDate: instance.startDate, endDate: instance.endDate,
    dateText: instance.startDate ? `${instance.startDate}${instance.endDate ? ` - ${instance.endDate}` : ''}` : summary.dateText || content?.dateText,
    summary: content?.summary || summary.summary, designerMessage: content?.designerMessage, createTime: instance.createTime,
    days: days.map(day => ({ id: day.id, dayNo: day.dayNo, title: day.title, summary: day.summary,
      items: items.filter(item => item.dayId === day.id).map(item => ({ ...item, projectTypeLabel: item.projectType, tagGroups: parseTagGroups(item.tagGroups) })) }))
  }
}
const fetchSummaries = async (rows: Trip[], request: number) => {
  offersError.value = ''
  try {
    const result = await commerce.offerSummaries(rows.map(t => t.id))
    if (request !== listRequest) return
    const map = new Map(result.map(r => [r.itineraryId, r]))
    rows.forEach(trip => {
      const summary = map.get(trip.id)
      trip.offerCount = summary?.offerCount || 0
      trip.latestOffer = summary?.latestOffer
      trip.pendingOffer = summary?.pendingOffer
      if (trip.status === 'WAITING_CONFIRMATION' && trip.pendingOffer) trip.statusName = 'Offer ready'
    })
  } catch (caught) {
    if (request === listRequest) offersError.value = caught instanceof Error ? caught.message : 'Could not load offer summaries.'
  }
}
const fetchTrips = async () => {
  const request = ++listRequest
  loading.value = true
  loadError.value = ''
  try {
    const result = await commerce.pageItineraries(currentPage.value, activeFilter.value)
    if (request !== listRequest) return
    trips.value = result.list.map(toTrip)
    total.value = result.total
    loading.value = false
    await fetchSummaries(trips.value, request)
  } catch (caught) {
    if (request === listRequest) loadError.value = caught instanceof Error ? caught.message : 'Request failed.'
  } finally { if (request === listRequest) loading.value = false }
}
const changePage = (page: number) => { currentPage.value = page; void fetchTrips() }
watch(activeFilter, () => { currentPage.value = 1; void fetchTrips() })
const closePlan = () => { ++planRequest; selectedTrip.value = null }
const openPlan = async (trip: Trip) => {
  const request = ++planRequest
  selectedTrip.value = trip
  planLoading.value = true
  planError.value = ''
  try {
    const result = await commerce.getItinerary(trip.itineraryNo)
    if (request === planRequest) selectedTrip.value = toTrip(result)
  } catch (caught) {
    if (request === planRequest) planError.value = caught instanceof Error ? caught.message : 'Could not load this plan.'
  } finally { if (request === planRequest) planLoading.value = false }
}
const closeHistory = () => { ++historyRequest; selectedOfferTrip.value = null; closeSnapshot() }
const openOffers = async (trip: Trip, page = 1) => {
  const request = ++historyRequest
  selectedOfferTrip.value = { ...trip, offers: [] }
  historyPage.value = page
  historyLoading.value = true
  historyError.value = ''
  try {
    const result = await commerce.offerHistory(trip.id, page)
    if (request !== historyRequest || !selectedOfferTrip.value) return
    selectedOfferTrip.value.offers = result.list
    historyTotal.value = result.total
  } catch (caught) {
    if (request === historyRequest) historyError.value = caught instanceof Error ? caught.message : 'Could not load offers.'
  } finally { if (request === historyRequest) historyLoading.value = false }
}
const closeSnapshot = () => { ++snapshotRequest; snapshotOffer.value = null; snapshotDetail.value = null }
const openDeepLink = async (no: string) => {
  const request = ++planRequest
  planLoading.value = true
  try {
    const result = await commerce.getItinerary(no)
    if (request !== planRequest) return
    const trip = toTrip(result)
    selectedTrip.value = trip
    planLoading.value = false
    const summaries = await commerce.offerSummaries([trip.id])
    if (request !== planRequest) return
    if (summaries[0]?.pendingOffer) { selectedTrip.value = null; await openOffers(trip) }
  } catch (caught) { if (request === planRequest) loadError.value = caught instanceof Error ? caught.message : 'Could not open itinerary.' }
  finally { if (request === planRequest) planLoading.value = false }
}

const tripStatusClass = (status: string) => ['WAITING_CONFIRMATION', 'WAITING_PAYMENT', 'UPCOMING'].includes(status) ? 'ready'
  : ['FINISHED', 'CLOSED', 'CANCELLED'].includes(status) ? 'past'
    : ['REVISION_REQUIRED', 'REVISING'].includes(status) ? 'revision' : 'working'

onMounted(async () => {
  if (!auth.token.value) { await initializeAccount(); return }
  const no = typeof route.query.itineraryNo === 'string' ? route.query.itineraryNo : ''
  const offerNo = typeof route.query.offerNo === 'string' ? route.query.offerNo : ''
  await Promise.all([initializeAccount(), fetchTrips(), ...(no ? [openDeepLink(no)] : [])])
  if (offerNo) {
    const matchedTrip = trips.value.find(t => t.pendingOffer?.offerNo === offerNo)
    if (matchedTrip && matchedTrip.pendingOffer) {
      await openConfirmOffer(matchedTrip, matchedTrip.pendingOffer)
    }
  }
})
onBeforeUnmount(() => { ++listRequest; closePlan(); closeHistory() })
watch(auth.token, () => { ++listRequest; trips.value = []; closePlan(); closeHistory() })
</script>

<style scoped>
.trip-toolbar {
  width: 100%;
  max-width: 940px;
  margin-bottom: 30px;
}

.filter-tabs {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  width: 100%;
  height: 32px;
  background: #ffffff;
  border-radius: 8.3px;
  box-shadow: 0 6px 6px 0 rgba(0, 0, 0, 0.02);
  overflow: hidden;
}

.filter-tabs button {
  height: 32px;
  width: 100%;
  border: none;
  background: transparent;
  color: rgba(0, 0, 0, 0.5);
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 400;
  text-align: center;
  cursor: pointer;
  transition: all 150ms ease;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.filter-tabs button:hover {
  color: #203d33;
}

.filter-tabs button.active {
  background: #203d33;
  color: #ffffff;
  border-radius: 8.3px;
  box-shadow: 0 6px 6px 0 rgba(0, 0, 0, 0.02);
}

.trip-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 940px;
}

.trip-card {
  width: 100%;
  max-width: 940px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 6px 6px 0 rgba(0, 0, 0, 0.03);
  padding: 20px;
  box-sizing: border-box;
  transition: box-shadow 180ms ease, transform 180ms ease;
}

.trip-card:hover {
  box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.05);
}

.trip-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.trip-card__meta {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #242424;
  font-size: 14px;
}

.trip-card__no {
  font-family: 'Noto Sans SC', sans-serif;
  font-weight: 400;
  text-transform: uppercase;
}

.trip-card__divider {
  width: 1px;
  height: 16px;
  background: rgba(75, 75, 75, 0.2);
}

.trip-card__time {
  font-family: 'Noto Sans SC', sans-serif;
  font-weight: 700;
}

.trip-card__status {
  font-family: 'Noto Sans SC', sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: #105446;
  text-align: right;
}

.trip-card__status.ready { color: #105446; }
.trip-card__status.revision { color: #8b631d; }
.trip-card__status.past { color: #6e7974; }
.trip-card__status.working { color: #2a573f; }

.trip-card__sep {
  height: 1px;
  margin: 16px 0 20px;
  background: #d4d7de;
  opacity: 0.5;
}

.trip-card__main {
  display: flex;
  gap: 18px;
}

.trip-card__media {
  width: 128px;
  height: 110px;
  flex: 0 0 128px;
  border-radius: 4px;
  overflow: hidden;
  background: #f6f4f0;
}

.trip-card__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.trip-card__content {
  min-width: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.trip-card__title {
  margin: 0 0 6px;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: #2e473d;
  line-height: 1.3;
}

.trip-card__summary {
  margin: 0 0 10px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: #2e473d;
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.trip-card__specs {
  display: flex;
  align-items: center;
  gap: 36px;
  height: 40px;
  padding: 0 16px;
  border-radius: 4px;
  background: linear-gradient(90deg, rgba(245, 246, 243, 1) 0%, rgba(248, 254, 250, 0) 88%);
}

.trip-spec-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: rgba(32, 61, 51, 0.8);
}

.trip-spec-icon {
  width: 16px;
  height: 16px;
  flex: 0 0 16px;
  background-color: currentColor;
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: center;
  -webkit-mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
}

.icon-pin {
  mask-image: url('/images/profile/icon-pin.svg');
  -webkit-mask-image: url('/images/profile/icon-pin.svg');
}

.icon-calendar {
  mask-image: url('/images/profile/icon-calendar.svg');
  -webkit-mask-image: url('/images/profile/icon-calendar.svg');
}

.icon-users {
  mask-image: url('/images/profile/icon-users.svg');
  -webkit-mask-image: url('/images/profile/icon-users.svg');
}

.trip-card__actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 10px;
}

.btn-trip-delete {
  width: 64px;
  height: 32px;
  padding: 0;
  border: 0.65px solid #000000;
  border-radius: 3.25px;
  background: transparent;
  color: #000000;
  font-family: 'Noto Sans SC', sans-serif;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  display: grid;
  place-items: center;
  transition: opacity 150ms ease;
}

.btn-trip-delete:hover {
  opacity: 0.7;
}

.btn-trip-plan {
  height: 32px;
  padding: 0 14px;
  border: 0.65px solid rgba(0, 0, 0, 0.5);
  border-radius: 3.25px;
  background: transparent;
  color: #203d33;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 150ms ease;
}

.btn-trip-plan:hover {
  background: rgba(32, 61, 51, 0.05);
  border-color: #203d33;
}

.btn-trip-offer-primary {
  height: 32px;
  padding: 0 14px;
  border: none;
  border-radius: 3.25px;
  background: #203d33;
  color: #ffffff;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background-color 150ms ease;
}

.btn-trip-offer-primary:hover {
  background: #2a573f;
}

.btn-trip-offer-secondary {
  height: 32px;
  padding: 0 14px;
  border: 0.65px solid #203d33;
  border-radius: 3.25px;
  background: transparent;
  color: #203d33;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 150ms ease;
}

.btn-trip-offer-secondary:hover {
  background: rgba(32, 61, 51, 0.06);
}

.btn-trip-pay {
  height: 32px;
  padding: 0 14px;
  border: none;
  border-radius: 3.25px;
  background: #203d33;
  color: #ffffff;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background-color 150ms ease;
}

.btn-trip-pay:hover {
  background: #2a573f;
}

.content-state {
  min-height: 340px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 9px;
  border-radius: 12px;
  background: #fff;
  color: #75827c;
  font-size: 13px;
  text-align: center;
  box-shadow: 0 6px 6px 0 rgba(0, 0, 0, 0.02);
}

.content-state strong { color: #2e4137; font-size: 16px; }
.content-state > span:not(.state-spinner) { max-width: 420px; line-height: 1.55; }
.content-state button, .content-state a { margin-top: 7px; padding: 10px 14px; border: 1px solid #174d40; background: #174d40; color: #fff; font-weight: 700; text-decoration: none; cursor: pointer; border-radius: 4px; }
.error-state > svg { color: #a33e35; font-size: 24px; }
.empty-symbol { width: 58px; height: 58px; display: grid; place-items: center; margin-bottom: 8px; border-radius: 50%; background: #edf3ee; color: #174d40; font-size: 22px; }
.state-spinner { width: 18px; height: 18px; border: 2px solid #ccd5d0; border-top-color: #174d40; border-radius: 50%; animation: spin .7s linear infinite; }

.modal-backdrop { position: fixed; z-index: 1500; inset: 0; display: grid; place-items: center; padding: 20px; background: rgba(11,28,22,.58); }
.trip-modal { width: min(880px, calc(100vw - 48px)); max-height: calc(100dvh - 64px); overflow-y: auto; padding: 36px 40px; background: #fff; box-shadow: 0 24px 70px rgba(8,28,20,.3); border-radius: 14px; }
.trip-modal.offer-history-modal { width: min(880px, calc(100vw - 48px)); }
.trip-modal header { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; padding-bottom: 20px; border-bottom: 1px solid #e1e7e2; }
.trip-modal header p { margin: 0 0 7px; color: #78877f; font-size: 10px; font-weight: 800; text-transform: uppercase; }
.trip-modal h2 { margin: 0; color: #173f34; font: 600 28px/1.2 'Playfair Display', Georgia, serif; }
.item-tag-groups { display: grid; gap: 4px; margin: 7px 0 0; }
.item-tag-groups > div { display: flex; gap: 7px; font-size: 10px; }
.item-tag-groups dt { color: #738078; font-weight: 800; }
.item-tag-groups dd { margin: 0; color: #496057; }
.trip-modal header button { width: 34px; height: 34px; border: 0; background: #f0f3f0; color: #52605b; font-size: 23px; cursor: pointer; border-radius: 50%; }
.modal-summary { margin: 20px 0; color: #64736c; font-size: 13px; line-height: 1.6; }
.day-list { display: grid; gap: 0; }
.day-section { display: grid; grid-template-columns: 70px 1fr; gap: 18px; padding: 22px 0; border-bottom: 1px solid #e6ebe7; }
.day-number { color: #174d40; font-size: 11px; font-weight: 800; text-transform: uppercase; }
.day-content h3 { margin: 0; color: #2a3c33; font-size: 16px; }
.day-content > p { margin: 6px 0 0; color: #7a8780; font-size: 12px; }
.day-content ol { display: grid; gap: 13px; margin: 18px 0 0; padding: 0; list-style: none; }
.day-content li { position: relative; display: flex; flex-direction: column; gap: 3px; padding-left: 16px; }
.day-content li::before { position: absolute; top: 5px; left: 0; width: 6px; height: 6px; border-radius: 50%; background: #bfdc72; content: ''; }
.day-content li span { color: #829088; font-size: 9px; font-weight: 800; text-transform: uppercase; }
.day-content li strong { color: #35473e; font-size: 13px; }
.day-content li p { margin: 0; color: #7e8b84; font-size: 11px; }
.no-days { padding: 50px 0; color: #7b8881; text-align: center; font-size: 13px; }

/* 报价记录弹窗样式 */
.offer-modal-body {
  padding: 16px 0;
}
.offer-modal-subtitle {
  margin: 0 0 16px;
  color: #64736c;
  font-size: 13px;
  line-height: 1.5;
}
.offer-timeline {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.offer-history-card {
  padding: 16px 18px;
  border: 1px solid #e2e7e3;
  border-radius: 8px;
  background: #fafbf9;
  transition: all 150ms ease;
}
.offer-history-card--active {
  border-color: #203d33;
  background: #ffffff;
  box-shadow: 0 4px 14px rgba(32, 61, 51, 0.08);
}
.offer-history-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}
.offer-history-card__meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.offer-status-badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 8px;
  border-radius: 4px;
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.2px;
}
.offer-status-badge--sent {
  background: #e8f5e9;
  color: #2e7d32;
}
.offer-status-badge--accepted {
  background: #e3f2fd;
  color: #1565c0;
}
.offer-status-badge--revision_requested {
  background: #fff3e0;
  color: #e65100;
}
.offer-status-badge--expired {
  background: #f5f5f5;
  color: #757575;
}
.offer-status-badge--cancelled {
  background: #ffebee;
  color: #c62828;
}
.offer-latest-pill {
  padding: 2px 6px;
  border-radius: 3px;
  background: #203d33;
  color: #ffffff;
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
}
.offer-no-code {
  font-family: 'JetBrains Mono', 'SF Mono', monospace;
  font-size: 13px;
  color: #2e473d;
}
.offer-create-time {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  color: #88958e;
}
.offer-history-card__tiers {
  margin: 10px 0;
  padding: 10px 14px;
  border-radius: 6px;
  background: #f4f6f4;
}
.tier-label {
  margin-bottom: 6px;
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 700;
  color: #5f7067;
  text-transform: uppercase;
}
.tier-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.tier-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  color: #35473e;
}
.tier-pax {
  font-weight: 500;
  min-width: 100px;
}
.tier-price-sep {
  color: #ccd5d0;
}
.offer-validity-info {
  margin-bottom: 12px;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  color: #6e7d75;
}
.offer-history-card__action {
  display: flex;
  justify-content: flex-end;
  padding-top: 6px;
}
.btn-offer-review-main {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  padding: 0 16px;
  border-radius: 4px;
  background: #203d33;
  color: #ffffff;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 600;
  text-decoration: none;
  transition: background-color 150ms ease;
}
.btn-offer-review-main:hover {
  background: #2a573f;
}
.btn-offer-view-snapshot {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  padding: 0 14px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  background: #ffffff;
  color: #203d33;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 150ms ease;
}
.btn-offer-view-snapshot:hover {
  opacity: 0.8;
}

/* 快照弹窗专属样式 */
.trip-modal.snapshot-modal {
  width: min(920px, calc(100vw - 48px));
  max-height: calc(100dvh - 60px);
  padding: 36px 44px;
}
.snapshot-loading {
  padding: 40px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #75827c;
  font-size: 13px;
}
.snapshot-error {
  padding: 30px 0;
  color: #a33e35;
  text-align: center;
  font-size: 13px;
}
.snapshot-modal-body {
  padding: 14px 0;
  display: flex;
  flex-direction: column;
  gap: 22px;
}
.snapshot-status-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  padding-bottom: 14px;
  border-bottom: 1px solid #edf1ee;
}
.snapshot-version-tag {
  padding: 3px 10px;
  border-radius: 4px;
  background: #eef2ef;
  color: #203d33;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 600;
}
.snapshot-validity-text {
  color: #7b8881;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
}
.snapshot-message-box {
  padding: 14px 18px;
  border-radius: 6px;
  background: #f6f8f5;
  border-left: 3px solid #203d33;
}
.snapshot-message-label {
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 700;
  color: #3d5248;
  text-transform: uppercase;
  margin-bottom: 4px;
}
.snapshot-message-box p {
  margin: 0;
  font-size: 13px;
  color: #496057;
  line-height: 1.6;
}
.snapshot-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.snapshot-section-title {
  margin: 0 0 6px;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 700;
  color: #203d33;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}
.snapshot-tiers-table {
  border: 1px solid #e1e7e2;
  border-radius: 6px;
  overflow: hidden;
}
.snapshot-tier-header {
  display: grid;
  grid-template-columns: 2fr 1.5fr 1.5fr;
  padding: 10px 14px;
  background: #f3f6f4;
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 700;
  color: #5f7067;
  text-transform: uppercase;
}
.snapshot-tier-row {
  display: grid;
  grid-template-columns: 2fr 1.5fr 1.5fr;
  padding: 11px 14px;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  color: #35473e;
  border-top: 1px solid #edf1ee;
  align-items: center;
}
.snapshot-day-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}
.snapshot-day-section {
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 20px;
  padding: 20px 0;
  border-bottom: 1px solid #e8ede9;
}
.snapshot-day-section:last-child {
  border-bottom: none;
}
.snapshot-day-number {
  color: #174d40;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
}
.snapshot-day-content h4 {
  margin: 0;
  color: #2a3c33;
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  font-weight: 700;
}
.snapshot-day-summary {
  margin: 6px 0 0;
  color: #7a8780;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  line-height: 1.5;
}
.snapshot-item-list {
  display: grid;
  gap: 12px;
  margin: 16px 0 0;
  padding: 0;
  list-style: none;
}
.snapshot-item-list li {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding-left: 18px;
}
.snapshot-item-list li::before {
  position: absolute;
  top: 6px;
  left: 0;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #bfdc72;
  content: '';
}
.snapshot-item-type {
  color: #829088;
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
}
.snapshot-item-list strong {
  color: #35473e;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
}
.snapshot-item-addr {
  margin: 0;
  color: #7e8b84;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
}

.trip-modal footer { display: flex; align-items: center; justify-content: flex-end; gap: 10px; padding-top: 20px; }
.btn-trip-close-modal {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 36px;
  padding: 0 18px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  background: #fff;
  color: #203d33;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 150ms ease;
}
.btn-trip-close-modal:hover {
  opacity: 0.8;
}

/* 确认报价弹窗专属样式 */
.trip-modal.confirm-offer-modal {
  width: min(880px, calc(100vw - 48px));
  max-height: calc(100dvh - 60px);
  padding: 36px 40px;
}
.confirm-offer-body {
  display: grid;
  grid-template-columns: 1.35fr 1fr;
  gap: 28px;
  padding: 18px 0;
}
.confirm-left-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.confirm-summary-box {
  padding: 14px 16px;
  background: #fafbf9;
  border: 1px solid #e1e7e2;
  border-radius: 8px;
}
.confirm-date-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #203d33;
  margin-bottom: 6px;
}
.confirm-summary-text {
  margin: 0;
  font-size: 13px;
  color: #6e7d75;
  line-height: 1.5;
}
.confirm-designer-note {
  padding: 12px 14px;
  background: #f6f8f5;
  border-left: 3px solid #203d33;
  border-radius: 6px;
}
.confirm-note-label {
  font-size: 11px;
  font-weight: 700;
  color: #3d5248;
  text-transform: uppercase;
  margin-bottom: 3px;
}
.confirm-designer-note p {
  margin: 0;
  font-size: 13px;
  color: #496057;
  line-height: 1.45;
}
.confirm-section-label {
  font-size: 12px;
  font-weight: 700;
  color: #203d33;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  margin-bottom: 8px;
}
.confirm-tier-pills {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.confirm-tier-pill {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: #f4f6f4;
  border-radius: 6px;
  font-size: 12px;
  color: #35473e;
}
.travelers-input-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}
.traveler-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.traveler-field label {
  font-size: 12px;
  font-weight: 600;
  color: #35473e;
}
.counter-input-wrap {
  display: flex;
  align-items: center;
  border: 1px solid #ccd5d0;
  border-radius: 6px;
  overflow: hidden;
  height: 38px;
  background: #fff;
}
.btn-counter {
  width: 38px;
  height: 38px;
  border: none;
  background: #f0f3f0;
  color: #203d33;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  display: grid;
  place-items: center;
  transition: background-color 150ms ease;
}
.btn-counter:hover:not(:disabled) {
  background: #e2e8e3;
}
.counter-input-wrap input {
  flex: 1;
  min-width: 0;
  height: 100%;
  border: none;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  color: #203d33;
}
.traveler-error-text {
  margin-top: 6px;
  color: #a33e35;
  font-size: 12px;
}
.points-field-row {
  display: flex;
  gap: 8px;
}
.points-input {
  flex: 1;
  height: 38px;
  padding: 0 12px;
  border: 1px solid #ccd5d0;
  border-radius: 6px;
  font-size: 13px;
}
.btn-use-all-points {
  height: 38px;
  padding: 0 12px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 6px;
  background: #fff;
  color: #203d33;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: opacity 150ms ease;
}
.btn-use-all-points:hover {
  opacity: 0.8;
}
.points-tip {
  display: block;
  margin-top: 4px;
  font-size: 11px;
  color: #829088;
}

/* 右侧账单卡片 */
.confirm-right-panel {
  display: flex;
  flex-direction: column;
}
.confirm-bill-card {
  padding: 22px 20px;
  background: #fafbf9;
  border: 1px solid #e1e7e2;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.bill-card-title {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: #203d33;
}
.bill-loading {
  padding: 16px 0;
  color: #829088;
  font-size: 13px;
  text-align: center;
}
.bill-breakdown {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 13px;
  color: #52605b;
}
.bill-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.bill-row strong {
  color: #2e473d;
}
.discount-row {
  color: #2e7d32;
  font-weight: 500;
}
.bill-divider {
  height: 1px;
  background: #e1e7e2;
  margin: 4px 0;
}
.bill-row.total-row {
  font-size: 14px;
  font-weight: 700;
  color: #203d33;
}
.total-amount {
  font-size: 20px;
  font-weight: 800;
  color: #203d33;
  font-family: 'Playfair Display', Georgia, serif;
}
.bill-validity {
  font-size: 11px;
  color: #88958e;
}
.bill-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 6px;
}
.btn-confirm-submit {
  height: 42px;
  border: none;
  border-radius: 6px;
  background: #203d33;
  color: #ffffff;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 150ms ease;
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn-confirm-submit:hover:not(:disabled) {
  background: #2a573f;
}
.btn-confirm-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.btn-confirm-revision {
  height: 36px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 6px;
  background: transparent;
  color: #52605b;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 150ms ease;
}
.btn-confirm-revision:hover {
  opacity: 0.8;
}
.revision-drawer {
  margin-top: 10px;
  padding-top: 12px;
  border-top: 1px dashed #ccd5d0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.revision-drawer label {
  font-size: 12px;
  font-weight: 600;
  color: #35473e;
}
.revision-drawer textarea {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #ccd5d0;
  border-radius: 6px;
  font-size: 12px;
  resize: vertical;
  box-sizing: border-box;
}
.revision-drawer-actions {
  display: flex;
  justify-content: flex-end;
}
.btn-send-revision {
  height: 32px;
  padding: 0 14px;
  border: none;
  border-radius: 4px;
  background: #203d33;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}
.btn-send-revision:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 768px) {
  .trip-card {
    padding: 16px;
  }
  .trip-card__header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  .trip-card__main {
    flex-direction: column;
    gap: 14px;
  }
  .trip-card__media {
    width: 100%;
    height: 160px;
    flex: 0 0 160px;
  }
  .trip-card__specs {
    flex-direction: column;
    align-items: flex-start;
    height: auto;
    padding: 10px 12px;
    gap: 8px;
  }
  .filter-tabs button {
    min-width: auto;
    padding: 0 14px;
  }
  .confirm-offer-body {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}
</style>
