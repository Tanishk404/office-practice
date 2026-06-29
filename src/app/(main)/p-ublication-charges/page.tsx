import React from 'react';

const PublicationCharges: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-8">
      
      {/* Sidebar */}
      <aside className="md:col-span-1">
        <ul className="space-y-3">
          <li>
            <a href="#publication-charges" className="text-blue-700 font-semibold hover:underline">
              Publication Charges
            </a>
          </li>
          <hr className="border-gray-200" />
          <li>
            <a href="#waiver-policy" className="text-blue-700 font-semibold hover:underline">
              Waiver Policy
            </a>
          </li>
          <hr className="border-gray-200" />
          <li>
            <a href="#additional charges" className="text-blue-700 font-semibold hover:underline">
              Additional Charges
            </a>
          </li>
          <hr className="border-gray-200" />
        </ul>
      </aside>

      {/* Main Content */}
      <main className="md:col-span-3 text-gray-800">
     

        <section className="mb-10" id='publication-charges'>
          <h2 className="text-xl font-bold text-black mb-4">Publication Charges</h2>
          <p className="mb-4 leading-relaxed">
            IP Indian Journal of Neurosciences (IJN) all manuscripts published as a fully Open Access (OA) journal. Open Access journals provide free access to readers and cover the costs of peer-review, copy editing, typesetting, long-term archiving, download of articles, sharing of articles, Indexing with various databases, and journal management, which require to pay Article Publication Charges (APC). An article publication charges applicable to accepted papers only, after the peer-review confirmation process. We accept payment in (Indian Rupees) for Indian authors and USD applicable for foreign authors. Additional (18 % GST - Goods and Services Taxes) will be applicable as per the norms of Govt. of India.
          </p>

          <p className="font-bold mb-2">Article Submission/Processing Charges: Nil</p>
          <p className="font-bold mb-4">Article Publication Charges (APC) are mentioned as below:</p>

          <table className="w-full border-collapse border border-gray-300 mb-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-3 text-left font-bold">APC by Country</th>
                <th className="border border-gray-300 p-3 text-left font-bold">APC</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-3 font-semibold">For Indian Authors</td>
                <td className="border border-gray-300 p-3">Rs. 6500/-</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-3 font-semibold">For International / Foreign Authors (Outside of India)</td>
                <td className="border border-gray-300 p-3">US $ 175</td>
              </tr>
            </tbody>
          </table>
          <p className="text-sm italic text-gray-600">Note: The article peer-review process normally takes an average of 8-12 weeks.</p>
        </section>

        <section className="mb-10" id='waiver-policy'>
          <h2 className="text-xl font-bold text-black mb-4">Waiver Policy</h2>
          <p className="leading-relaxed">
            The journal has a waiver policy to help & support researchers who are unable to meet some of the costs associated with publishing open-access (OA) articles. The Journal grants up to 20% waiver to low-income economies listed countries on Article Publication Charges but there is a waiver qualifying criteria that can be checked <a href="#" className="text-blue-600 underline font-semibold">here</a>. Requests to apply up to 20% reduction in APC should be made when submitting your manuscript by contacting on <a href="mailto:info@ipinnovative.com" className="text-blue-600 underline font-semibold">info@ipinnovative.com</a>, requests made during the review process or after acceptance will not be considered.
          </p>
        </section>

        <section id="additional charges" className="mb-10">
          <h2 className="text-xl font-bold text-black mb-4">Additional Charges</h2>
          <p className="mb-2">There are some additional charges that we charge in some exceptional cases which are mentioned below:</p>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li>For the colour print of the article, we are charging 500/- (from Indian authors) and an additional 25 USD (from foreign authors).</li>
            <li>For more than 5 authors, we charge 1000/- per author (for Indian authors) and 35 USD (for foreign authors).</li>
            <li>For additional hardcopy, we are charging Rs.1000/- (from Indian authors) and 70 USD (from foreign authors) per additional copy for individual authors. These charges include postal expenses as well.</li>
          </ul>
          <p className="mb-4">This additional charge-related information is mentioned on our <a href="#" className="text-blue-600 underline font-semibold">Submission Portal - MPRP</a> also which can be seen by authors at the time of article submission.</p>
          <p className="font-bold">Please Visit for Payment Details:- <a href="#" className="text-blue-600 underline">Click here</a></p>
          <p className="font-bold">Please Visit for Waiver Policy: <a href="#" className="text-blue-600 underline">Waiver Policy</a></p>
        </section>
      </main>
    </div>
  );
};

export default PublicationCharges;