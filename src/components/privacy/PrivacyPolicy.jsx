import LegalLayout, { SectionTitle, PolicyText } from "./policy";

export default function PrivacyPolicy() {
  return (
    <LegalLayout title="Privacy Policy">
      <PolicyText>
        Customers are responsible for providing accurate and complete shipping information at the time of placing an order. Digident shall not be liable for delays, non-delivery, or additional costs arising due to incorrect or incomplete address details provided by the customer.
      </PolicyText>

      <SectionTitle>Information Collection</SectionTitle>
      <PolicyText>
        Digident may collect personal information such as name, contact details including email address and mobile number, billing and shipping address, payment-related details, and any other information voluntarily provided by the user while placing an order, creating an account, contacting customer support, or communicating with Digident. In addition, certain non-personal information such as IP address, browser type, device details, and website usage data may be collected automatically to enhance website functionality and improve user experience.
      </PolicyText>

      <SectionTitle>Data Usage & Security</SectionTitle>
      <PolicyText>
       The information collected is used solely for legitimate business purposes, including processing and fulfilling orders, managing deliveries, providing customer support, communicating order updates, responding to inquiries, improving products and services, and ensuring compliance with applicable laws and regulatory requirements. Digident does not sell, rent, or trade personal information to third parties. However, information may be shared with trusted third-party service providers such as payment gateways, courier and logistics partners, IT service providers, or government authorities, strictly for order fulfillment, payment processing, delivery services, or legal compliance. All such third parties are required to maintain confidentiality and use the information only for the intended purpose.
      </PolicyText>

      <PolicyText>
       Payment transactions are processed through secure third-party payment gateways, and Digident does not store or retain complete credit card, debit card, UPI, or banking details. Digident implements reasonable technical and organizational security measures to protect personal information from unauthorized access, misuse, alteration, or disclosure. While every effort is made to safeguard user data, Digident cannot guarantee absolute security of information transmitted over the internet.
      </PolicyText>

        <PolicyText>
         Digident may use cookies and similar technologies to analyze website traffic, improve performance, and enhance user experience. Users may choose to disable cookies through browser settings; however, certain website features may not function optimally as a result. Personal information shall be retained only for as long as necessary to fulfill the purpose for which it was collected or as required under applicable laws, after which it shall be securely deleted or anonymized.
        </PolicyText>

      <SectionTitle>Your Rights</SectionTitle>
      <PolicyText>
        Users have the right to access, update, correct, or request deletion of their personal information, subject to legal and regulatory requirements. Requests relating to personal data may be addressed to Digident using the contact details provided below. Digident’s website may contain links to third-party websites, and Digident shall not be responsible for the privacy practices or content of such external websites.
      </PolicyText>
      <PolicyText>
        Digident reserves the right to modify or update this Privacy Policy at any time without prior notice. Any changes shall become effective immediately upon being posted on the website, and continued use of the website shall constitute acceptance of the revised policy.
      </PolicyText>
    </LegalLayout>
  );
}