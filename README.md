# 3ABBILO integration stage — NOT a live deployment

This is a source-code component, not a complete all-services integration.

## Included
- `wholesale/service-capabilities.js`: fail-closed service capability registry for the existing FazerCards and Extra4Card routes.

## Not included / not yet safe to enable
- Alfa, Touch, Ogero/DSL, Wise, Mobi, Sodetel, Terranet, CARFAX, Gift Cards, eSIM supplier quote, validation, purchase, and order reconciliation.
- Dealer pricing configuration (user will supply later).
- End-to-end Daftra balance and product stock reconciliation for these new services.

Do not deploy this archive as a complete application. It does not change the current working frontend or backend and cannot activate missing services.
