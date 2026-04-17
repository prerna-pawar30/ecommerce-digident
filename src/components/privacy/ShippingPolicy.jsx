import LegalLayout, { SectionTitle, PolicyText, BulletList } from "./policy";

export default function ShippingPolicy() {
  return (
    <LegalLayout title="Shipping Policy">
      <PolicyText>
       Digident India Pvt. Ltd. ensures reliable and timely delivery of its dental implant accessories and components to customers across India. Shipping services are available on a PAN India basis. International orders may also be accepted subject to logistics feasibility and applicable customs regulations.
      </PolicyText>

      <SectionTitle>Processing & Delivery</SectionTitle>
      <PolicyText>
        All orders are processed only after successful confirmation of payment. Once confirmed, orders are generally dispatched within 2 to 3 business days, excluding Sundays and public holidays. After dispatch, deliveries within India are expected to be completed within 5 to 10 business days, depending on the delivery location and the operational timelines of the courier service providers.
      </PolicyText>
      <PolicyText>
        Digident offers free shipping on all orders. Cash on Delivery (COD) is not available. Orders are shipped through local and third-party courier and logistics partners appointed by Digident. While every effort is made to ensure timely delivery, actual delivery timelines are subject to the courier partner’s service conditions and operational constraints.
      </PolicyText>
      <PolicyText>
        In the event of any delay in delivery, Digident shall inform the customer and provide the reason for such delay along with the corrective measures being undertaken. Where necessary, delivery shall be rescheduled, and customers shall be kept informed accordingly.
      </PolicyText>

      <SectionTitle>Force Majeure</SectionTitle>
      <PolicyText>
        Digident shall not be held responsible for delays or failure in delivery arising from circumstances beyond its reasonable control, including but not limited to natural disasters, government actions, strikes, logistical disruptions, or other force majeure events. In such situations, Digident shall notify the customer as soon as reasonably possible, and its delivery obligations shall remain suspended for the duration of the force majeure event. A revised delivery schedule shall be communicated once the impact of such event is assessed, and both parties shall cooperate to minimize disruption.
      </PolicyText>

      <SectionTitle>Customer Responsibility</SectionTitle>
      <PolicyText>
        Customers are responsible for providing accurate and complete shipping information at the time of placing an order. Digident shall not be liable for delays, non-delivery, or additional costs arising due to incorrect or incomplete address details provided by the customer.
        </PolicyText>
    </LegalLayout>
  );
}