<template>
  <main class="legal-page">
    <article class="legal-document" aria-labelledby="terms-title">
      <header class="legal-document__header">
        <p>Legal</p>
        <h1 id="terms-title">Terms &amp; Conditions</h1>
      </header>

      <section class="legal-section">
        <h2>Overview</h2>
        <p>This website is operated by lvyv.com. Throughout lvyv.com, the terms "we", "us" and "our" refer to lvyv.com. lvyv.com offers this website, including all information, tools and services available from this site to you, the user, subject to your acceptance of all terms, conditions, policies and notices stated here.</p>
        <p>By visiting lvyv.com and/or purchasing something from us, you engage in our "Service" and agree to be bound by these Terms &amp; Conditions, including any additional terms, conditions and policies referenced here or available by hyperlink. These Terms &amp; Conditions apply to all users of lvyv.com, including browsers, vendors, customers, merchants and contributors of content.</p>
        <p>Please read these Terms &amp; Conditions carefully before accessing or using lvyv.com. By accessing or using any part of the site, you agree to be bound by them. If you do not agree to all of these terms, you may not access lvyv.com or use any services. New features or tools added to the Service are also subject to these Terms &amp; Conditions. We may update, change or replace any part of these Terms &amp; Conditions by posting changes to lvyv.com. Your continued use after changes are posted constitutes acceptance of those changes.</p>
      </section>

      <section v-for="section in sections" :key="section.title" class="legal-section">
        <h2>{{ section.title }}</h2>
        <p v-for="paragraph in section.paragraphs" :key="paragraph">{{ paragraph }}</p>
      </section>

      <section class="legal-section legal-section--reference" aria-labelledby="reference-title">
        <h2 id="reference-title">Terms Reference</h2>
        <p class="legal-subject"><strong>Contracting entity:</strong> Lvyv International Travel &amp; Culture Co., Ltd.</p>
        <object data="https://www.9-bill.com/index/text" style="width:100%" title="Terms and Conditions reference">
          <p>
            <a href="https://www.9-bill.com/index/text" target="_blank" rel="noopener noreferrer">View the Terms and Conditions reference</a>
          </p>
        </object>
      </section>
    </article>
  </main>
</template>

<script setup lang="ts">
const title = 'Terms & Conditions | Lvyv'
const description = 'Terms and Conditions for lvyv.com services.'

const sections = [
  {
    title: 'Section 1 - Online Store Terms',
    paragraphs: [
      'By agreeing to these Terms & Conditions, you may not use our products for any illegal or unauthorized purpose or, in using the Service, violate any laws in your jurisdiction, including copyright laws.',
      'You must not transmit worms, viruses or any code of a destructive nature. A breach or violation of any of these Terms may result in immediate termination of your Services.'
    ]
  },
  {
    title: 'Section 2 - General Conditions',
    paragraphs: [
      'We reserve the right to refuse service to anyone for any reason at any time. You understand that your content, excluding credit card information, may be transferred unencrypted over various networks and changed to conform and adapt to the technical requirements of connecting networks or devices. Credit card information is always encrypted during transfer over networks.',
      'You agree not to reproduce, duplicate, copy, sell, resell or exploit any portion of the Service, use of the Service, access to the Service, or any contact on lvyv.com through which the Service is provided, without our express written permission. The headings in this agreement are for convenience only and do not limit or otherwise affect these Terms.'
    ]
  },
  {
    title: 'Section 3 - Accuracy, Completeness and Timeliness of Information',
    paragraphs: [
      'Material on lvyv.com is provided for general information only and should not be relied upon as the sole basis for making decisions without consulting primary, more accurate, more complete or more timely sources of information. Any reliance on material on this site is at your own risk.',
      'lvyv.com may contain historical information that is not current and is provided for reference only. We reserve the right to modify site content at any time, but have no obligation to update information on lvyv.com. You are responsible for monitoring changes to our site.'
    ]
  },
  {
    title: 'Section 4 - Modifications to the Service and Prices',
    paragraphs: [
      'Prices for our products are subject to change without notice. We reserve the right at any time to modify or discontinue the Service, or any part or content of it, without notice.'
    ]
  },
  {
    title: 'Section 5 - Products or Services',
    paragraphs: [
      'Certain products or services may be available exclusively online through lvyv.com. These products or services may have limited quantities and are subject to return or exchange only according to our Return Policy. We have made every effort to display product colors and images accurately, but cannot guarantee that your computer monitor displays every color accurately.',
      'We reserve the right, but are not obligated, to limit sales of our products or Services to any person, geographic region or jurisdiction on a case-by-case basis, to limit quantities offered, or to discontinue any product at any time. Any offer for a product or service made on this site is void where prohibited.'
    ]
  },
  {
    title: 'Section 6 - Accuracy of Billing and Account Information',
    paragraphs: [
      'We reserve the right to refuse any order you place with us. We may, in our sole discretion, limit or cancel quantities purchased per person, household or order. These restrictions may include orders placed under the same customer account, with the same credit card, or using the same billing or shipping address. If we change or cancel an order, we may attempt to notify you using the email address, billing address or phone number provided when the order was made. We may limit or prohibit orders that appear to be placed by dealers, resellers or distributors.',
      'You agree to provide current, complete and accurate purchase and account information for all purchases made through lvyv.com, and to promptly update your account information, including your email address and payment-card details, so we can complete transactions and contact you when needed. For more details, please review our Return Policy.'
    ]
  },
  {
    title: 'Section 7 - Optional Tools',
    paragraphs: [
      'We may provide access to third-party tools over which we neither monitor nor have control or input. You acknowledge and agree that access to those tools is provided "as is" and "as available" without warranties, representations, conditions or endorsement. We have no liability arising from or relating to your use of optional third-party tools.',
      'Your use of optional tools offered through lvyv.com is entirely at your own risk and discretion. You should ensure that you are familiar with and approve the terms on which the relevant third-party providers make tools available. New services, features, tools and resources offered through lvyv.com are also subject to these Terms & Conditions.'
    ]
  },
  {
    title: 'Section 8 - Third-Party Links',
    paragraphs: [
      'Certain content, products and services available through the Service may include materials from third parties. Third-party links may direct you to websites that are not affiliated with us. We are not responsible for examining or evaluating their content or accuracy, and we do not warrant or accept liability for third-party materials, websites, products or services.',
      'We are not liable for harm or damages related to purchases, use of goods or services, resources, content or other transactions made in connection with third-party websites. Please review third-party policies and practices carefully before entering into a transaction. Complaints, claims, concerns or questions regarding third-party products should be directed to the relevant third party.'
    ]
  },
  {
    title: 'Section 9 - User Comments, Feedback and Other Submissions',
    paragraphs: [
      'If, at our request, you send specific submissions, or if you send creative ideas, suggestions, proposals, plans or other materials by any means, you agree that we may at any time, without restriction, edit, copy, publish, distribute, translate and otherwise use in any medium any comments you forward to us. We are under no obligation to keep comments confidential, pay compensation for comments or respond to comments.',
      'We may, but have no obligation to, monitor, edit or remove content that we determine in our sole discretion is unlawful, offensive, threatening, libelous, defamatory, pornographic, obscene, otherwise objectionable, or violates any party\'s intellectual property or these Terms. Your comments must not violate any third-party right or contain unlawful, abusive, obscene or malicious material. You are solely responsible for the comments you make and their accuracy.'
    ]
  },
  {
    title: 'Section 10 - Personal Information',
    paragraphs: [
      'Your submission of personal information through lvyv.com is governed by our Privacy Policy.'
    ]
  },
  {
    title: 'Section 11 - Errors, Inaccuracies and Omissions',
    paragraphs: [
      'Occasionally, information on lvyv.com or in the Service may contain typographical errors, inaccuracies or omissions relating to product descriptions, pricing, promotions, offers, shipping charges, transit times or availability. We reserve the right to correct errors, inaccuracies or omissions, and to change or update information or cancel orders if information in the Service or on any related site is inaccurate at any time without prior notice, including after you submit an order.',
      'We undertake no obligation to update, amend or clarify information in the Service or on related sites, including pricing information, except as required by law. No specified update or refresh date should be taken to indicate that all information has been modified or updated.'
    ]
  },
  {
    title: 'Section 12 - Prohibited Uses',
    paragraphs: [
      'In addition to other prohibitions in these Terms, you are prohibited from using lvyv.com or its content for any unlawful purpose; to solicit unlawful acts; to violate applicable regulations, rules, laws or ordinances; to infringe intellectual-property rights; to harass, abuse, insult, harm, defame, slander, intimidate or discriminate; to submit false or misleading information; to upload or transmit viruses or malicious code; to collect or track personal information of others; to spam, phish, pharm, pretext, spider, crawl or scrape; for any obscene or immoral purpose; or to interfere with or circumvent security features of the Service, related sites, other websites or the Internet.',
      'We reserve the right to terminate your use of the Service or any related website for violating any prohibited use.'
    ]
  },
  {
    title: 'Section 13 - Disclaimer of Warranties; Limitation of Liability',
    paragraphs: [
      'We may remove the Service for indefinite periods or cancel the Service at any time without notice. Your use of, or inability to use, the Service is at your sole risk. The Service and all products and services delivered through it are provided "as is" and "as available", except as expressly stated by us, without representation, warranties or conditions of any kind, whether express or implied, including implied warranties or conditions of merchantability, merchantable quality, fitness for a particular purpose, durability, title and non-infringement.',
      'To the maximum extent permitted by law, lvyv.com and its directors, officers, employees, affiliates, agents, contractors, suppliers, service providers and licensors are not liable for injury, loss, claim, or direct, indirect, incidental, punitive, special or consequential damages of any kind arising from your use of the Service or products procured through it, including lost profits, revenue, savings, data or replacement costs, whether based in contract, tort, strict liability or otherwise.'
    ]
  },
  {
    title: 'Section 14 - Indemnification',
    paragraphs: [
      'You agree to indemnify, defend and hold harmless lvyv.com and our parent, subsidiaries, affiliates, partners, officers, directors, agents, contractors, licensors, service providers, subcontractors, suppliers, interns and employees from any claim or demand, including reasonable attorneys\' fees, made by a third party due to or arising from your breach of these Terms or documents incorporated by reference, or your violation of any law or third-party right.'
    ]
  },
  {
    title: 'Section 15 - Severability',
    paragraphs: [
      'If any provision of these Terms & Conditions is determined to be unlawful, void or unenforceable, that provision will nevertheless be enforceable to the fullest extent permitted by applicable law. The unenforceable portion will be deemed severed from these Terms & Conditions and will not affect the validity and enforceability of the remaining provisions.'
    ]
  },
  {
    title: 'Section 16 - Termination',
    paragraphs: [
      'Obligations and liabilities incurred before termination survive termination of this agreement for all purposes. These Terms & Conditions are effective unless and until terminated by you or us. You may terminate them at any time by notifying us that you no longer wish to use our Services, or when you cease using lvyv.com.',
      'If, in our sole judgment, you fail or we suspect that you have failed to comply with any term or provision of these Terms, we may terminate this agreement at any time without notice. You remain liable for amounts due up to and including the date of termination, and we may deny you access to the Services or any part of them.'
    ]
  },
  {
    title: 'Section 17 - Entire Agreement',
    paragraphs: [
      'Our failure to exercise or enforce any right or provision of these Terms does not constitute a waiver of that right or provision. These Terms & Conditions and any policies or operating rules posted by us on lvyv.com or in respect of the Service constitute the entire agreement and understanding between you and us, superseding prior or contemporaneous agreements, communications and proposals, whether oral or written. Ambiguities in the interpretation of these Terms will not be construed against the drafting party.'
    ]
  },
  {
    title: 'Section 18 - Governing Law',
    paragraphs: [
      'These Terms & Conditions and any separate agreements through which we provide Services are governed by and construed in accordance with the laws of the United Kingdom.'
    ]
  },
  {
    title: 'Section 19 - Changes to Terms & Conditions',
    paragraphs: [
      'You can review the most current version of these Terms & Conditions at any time on this page. We reserve the right, at our sole discretion, to update, change or replace any part of these Terms by posting updates and changes to lvyv.com. It is your responsibility to check lvyv.com periodically for changes. Your continued use of or access to lvyv.com or the Service after changes are posted constitutes acceptance of those changes.'
    ]
  }
]

useLvyvSeo({
  title,
  description,
  path: '/terms',
  noindex: true,
  jsonLd: webPageJsonLd(title, description, '/terms')
})
</script>

<style scoped>
.legal-page {
  background: #f5f8f5;
  padding: 116px max(24px, calc((100vw - 900px) / 2)) 72px;
}

.legal-document {
  margin: 0 auto;
  max-width: 900px;
  background: #fff;
  border: 1px solid #d9e2db;
  padding: 52px 64px 64px;
}

.legal-document__header {
  padding-bottom: 28px;
  border-bottom: 1px solid #d9e2db;
}

.legal-document__header p {
  margin: 0 0 8px;
  color: #6c8175;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
}

.legal-document h1,
.legal-document h2 {
  color: #173f34;
  font-family: 'Playfair Display', Georgia, serif;
}

.legal-document h1 {
  margin: 0;
  font-size: 40px;
  line-height: 1.18;
}

.legal-section { margin-top: 38px; }
.legal-section h2 { margin: 0 0 16px; font-size: 23px; line-height: 1.3; }
.legal-section p { margin: 0 0 16px; color: #43564d; font-size: 16px; line-height: 1.7; }
.legal-section p:last-child { margin-bottom: 0; }
.legal-section--reference { padding-top: 32px; border-top: 1px solid #d9e2db; }
.legal-section--reference object { display: block; min-height: 180px; border: 0; }
.legal-section--reference a { color: #174d40; font-weight: 700; text-decoration: underline; text-underline-offset: 3px; }

@media (max-width: 767px) {
  .legal-page { padding: 96px 16px 40px; }
  .legal-document { padding: 34px 22px 42px; }
  .legal-document h1 { font-size: 32px; }
  .legal-section h2 { font-size: 21px; }
}
</style>
