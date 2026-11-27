<template>
  <dialog ref="dialog" class="encounter-booking-dialog" aria-labelledby="booking-title" @click.self="close">
    <div class="encounter-booking-dialog__content">
      <button class="encounter-booking-dialog__close" type="button" aria-label="Close booking" @click="close">×</button>
      <EncounterBooking id="route-booking-form" :product="product" :product-name="productName" :sku="sku" :status="status"
        :order-note="orderNote" :show-package="showPackage" @retry="emit('retry')" />
    </div>
  </dialog>
</template>

<script setup lang="ts">
import type { EncounterProduct } from '~~/shared/utils/encounterProducts'
import type { CatalogSku } from '~/composables/useCommerce'

defineProps<{
  product: EncounterProduct
  productName: string
  sku?: CatalogSku
  status: 'idle' | 'pending' | 'success' | 'error'
  orderNote?: string
  showPackage?: boolean
}>()
const emit = defineEmits<{ retry: [] }>()
const dialog = useTemplateRef('dialog')
const close = () => dialog.value?.close()
defineExpose({ open: () => dialog.value?.showModal() })
</script>

<style scoped>
.encounter-booking-dialog {
  position: fixed;
  inset: 0;
  width: min(620px, calc(100% - 32px));
  max-height: calc(100% - 32px);
  padding: 0;
  margin: auto;
  border: 0;
  border-radius: 24px;
  color: inherit;
  background: #f2f7ee;
}

.encounter-booking-dialog::backdrop {
  background: rgb(22 44 36 / 62%);
}

.encounter-booking-dialog__content { position: relative; }

.encounter-booking-dialog__close {
  position: absolute;
  z-index: 1;
  top: 10px;
  right: 12px;
  width: 36px;
  height: 36px;
  padding: 0;
  background: transparent;
  border: 0;
  color: #1e3a2f;
  font-size: 24px;
  cursor: pointer;
}
</style>
