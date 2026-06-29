
import React from 'react';
import Link from 'next/link';

const SubscriptionPage: React.FC = () => {

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Subscription Pricing</h1>

      {/* Subscription Table */}
      <div className="overflow-x-auto mb-8">
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-3" colSpan={5}>Subscription Rate for 2026</th>
            </tr>
            <tr className="bg-gray-50">
              <th className="border border-gray-300 p-2"></th>
              <th className="border border-gray-300 p-2" colSpan={2}>Indian (INR)</th>
              <th className="border border-gray-300 p-2" colSpan={2}>Overseas (USD $)</th>
            </tr>
            <tr className="bg-gray-50">
              <th className="border border-gray-300 p-2"></th>
              <th className="border border-gray-300 p-2">Institutional</th>
              <th className="border border-gray-300 p-2">Individual</th>
              <th className="border border-gray-300 p-2">Institutional</th>
              <th className="border border-gray-300 p-2">Individual</th>
            </tr>
          </thead>
          <tbody className="text-center">
            <tr>
              <td className="border border-gray-300 p-2 text-left font-semibold">Print</td>
              <td className="border border-gray-300 p-2">6200</td>
              <td className="border border-gray-300 p-2">4000</td>
              <td className="border border-gray-300 p-2">320</td>
              <td className="border border-gray-300 p-2">300</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2 text-left font-semibold">Online</td>
              <td className="border border-gray-300 p-2">0</td>
              <td className="border border-gray-300 p-2">0</td>
              <td className="border border-gray-300 p-2">0</td>
              <td className="border border-gray-300 p-2">0</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2 text-left font-semibold">Print + Free Online</td>
              <td className="border border-gray-300 p-2">6200</td>
              <td className="border border-gray-300 p-2">4000</td>
              <td className="border border-gray-300 p-2">320</td>
              <td className="border border-gray-300 p-2">300</td>
            </tr>
          </tbody>
        </table>
      </div>

      <Link href={('https://ipinnovative.com/subscription?journal=ijn&year=2026')} className="bg-gray-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-gray-700 mb-20">
        Subscribe Journal
      </Link>

      {/* Payment and Contact Details */}
      <div className="grid md:grid-cols-2 gap-8 text-gray-800">
        <section>
          <h2 className="text-xl font-bold mb-4">Payment Details:-</h2>
          <p className="mb-2"><strong>Payment:</strong> 100% Advance Payment Cheque / DD / RTGS / NEFT will be made in favour of "<strong>IP Innovative Publication Pvt. Ltd.</strong>", Payable at New Delhi, India</p>
          <p><strong>Bank Name:</strong> Axis Bank Ltd., Branch - Palam, New Delhi</p>
          <p><strong>Current Account No:</strong> 917020045271486, <strong>IFSC Code:</strong> UTIB0000132, <strong>Swift Code:</strong> AXISINBB132, <strong>PAN No:</strong> AAECI4006K</p>
          <p className="mt-2"><strong>Payment Option for Outside of India:</strong> PayPal option applicable only for the outside of India. Subscriber can send payment via PayPal account.</p>
          <p><strong>PayPal Account:</strong> subscription@ipinnovative.com</p>
          <p className="mt-2 font-semibold">Please send your payment details to subscription@ipinnovative.com, subscription1.ippl@gmail.com</p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4">Contact Details:</h2>
          <p className="font-bold">IP Innovative Publication Pvt. Ltd</p>
          <p>3rd Floor, A-2, Gulab Bagh, Nawada, Metro Pillar No.733</p>
          <p>Uttam Nagar, New Delhi - 110059, India</p>
          <p className="mt-2"><strong>Ph:</strong> +91-11-61364114, 61364115, 40582495, Ext. 12 & 21</p>
          <p><strong>Mail:</strong> <a href="mailto:subscription@ipinnovative.com" className="text-blue-600 hover:underline">subscription@ipinnovative.com</a></p>
          <p><strong>Web:</strong> <a href="https://www.ipinnovative.com" className="text-blue-600 hover:underline">www.ipinnovative.com</a></p>
        </section>
      </div>
    </div>
  );
};

export default SubscriptionPage;