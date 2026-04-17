import LegalLayout, { SectionTitle, PolicyText, BulletList } from "./policy";

export default function ReturnPolicy() {
  return (
    <LegalLayout title="Exchange & Return Policy">
      <PolicyText>
        <strong>DIGIDENT INDIA PVT. LTD.</strong> allows returns only in limited circumstances to ensure hygiene, safety, and product integrity. A return request must be initiated within <strong>7 days</strong> from the date of delivery.
      </PolicyText>

      <SectionTitle>Eligibility Criteria</SectionTitle>
      <PolicyText>
        Digident allows returns only in limited circumstances to ensure hygiene, safety, and product integrity. A return request must be initiated within 7 days from the date of delivery and shall be accepted only in cases where the product received is damaged, defective, or incorrect, or where there is a manufacturing defect or transit-related damage.
      </PolicyText>

      <PolicyText>
       Due to the nature of dental implant accessories and components, products once opened, used, or unsealed cannot be returned, as this may compromise hygiene and safety standards. All return requests are subject to verification and approval by Digident.
      </PolicyText>
      <PolicyText>
        To initiate a return or replacement request, customers are required to contact our customer support team by sharing their order details along with clear images evidencing the defect, damage, or incorrect product. Upon verification and approval, the customer must ship the product back in its original packaging, including all labels, seals, invoices, and accessories. The cost of return shipping shall be borne by the customer, and Digident shall not be responsible for any loss or damage during return transit.
      </PolicyText>
      <PolicyText>
        In cases where a product qualifies for replacement, Digident shall replace the same product only. Customers shall not be entitled to select an alternative product in exchange. If a replacement is not available, Digident shall process a refund as per the terms of this policy.
      </PolicyText>

      <SectionTitle>Non-Returnable Products</SectionTitle>
      <PolicyText>
        <PolicyText>
        In cases where a product qualifies for replacement, Digident shall replace the same product only. Customers shall not be entitled to select an alternative product in exchange. If a replacement is not available, Digident shall process a refund as per the terms of this policy.
      </PolicyText>
      </PolicyText>

      <SectionTitle>Refund Policy</SectionTitle>
      <PolicyText>
        Refunds, where applicable, shall be processed only after the returned product is received, inspected, and approved by Digident. Approved refunds will be credited to the original mode of payment used at the time of purchase.
      </PolicyText>

        <PolicyText>
            The refund amount shall be processed within 7 to 10 business days from the date of approval. Any delay caused by banks, payment gateways, or third-party service providers shall be beyond Digident’s control. No additional deductions or non-refundable charges shall be applied unless expressly communicated at the time of purchase.
        </PolicyText>

      <SectionTitle>Cancellation Policy</SectionTitle>
      <PolicyText>
        Order cancellations are permitted only before the product has been dispatched from Digident’s warehouse. Once an order has been dispatched, cancellation requests shall not be accepted under any circumstances.
      </PolicyText>
      <PolicyText>
        Customers seeking cancellation must contact Digident’s customer support team at the earliest. Upon confirmation that the order has not been dispatched, the cancellation shall be approved and a refund shall be processed as per the refund timeline stated above.
      </PolicyText>
      <PolicyText>
        Cash on Delivery (COD) orders are not available, and therefore no separate COD cancellation policy applies.
      </PolicyText>
    </LegalLayout>
  );
}