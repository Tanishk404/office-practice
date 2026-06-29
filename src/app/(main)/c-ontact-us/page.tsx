import React from 'react';

const ContactUs: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-8">
      {/* Sidebar */}
      <aside className="md:col-span-1">
        <h2 className="text-xl font-bold mb-4">Contact Us</h2>
        <ul className="space-y-3">
          <li>
            <a href="#editorial-office" className="text-blue-600 hover:underline block">
              Editorial Office
            </a>
          </li>
          <hr className="border-gray-200" />
          <li>
            <a href="#publisher-address" className="text-blue-600 hover:underline block">
              Publisher Address
            </a>
          </li>
          <hr className="border-gray-200" />
        </ul>
      </aside>

      {/* Main Content */}
      <main className="md:col-span-3 space-y-12">
        {/* Editorial Office Section */}
        <section id="editorial-office">
          <h2 className="text-xl font-bold mb-3">Editorial Office</h2>
          <div className="text-gray-800 space-y-1">
            <p className="font-bold">Khyati Education and Research Foundation</p>
            <p>Dr. Deepak Kumar Singh</p>
            <p>Professor and Head</p>
            <p>Department of Department of Neurosurgery</p>
            <p>Dr. Ram Manohar Lohia Institute of Medical Sciences, Lucknow, Uttar Pradesh</p>
            <p><span className="font-bold">Country:</span> India</p>
            <p className="font-bold">Email id: 
               <span className="font-normal"> drdeepak.kr.singh@drrmlims.ac.in, gkp.deepak@gmail.com, editorialoffice@khyatieducation.org</span>
            </p>
          </div>
        </section>

        {/* Publisher Address Section */}
        <section id="publisher-address">
          <h2 className="text-xl font-bold mb-3">Publisher Address</h2>
          <div className="text-gray-800 space-y-1">
            <p className="font-bold">IP Innovative Publication Pvt. Ltd</p>
            <p>A-2, Gulab Bagh, Nawada, Metro Pillar No. 733</p>
            <p>Uttam Nagar, New Delhi – 110059, India</p>
            <p className="font-bold mt-2">Ph: <span className="font-normal">+91-11-61364114, 61364115</span></p>
            <p className="font-bold">Mail: <a href="mailto:info@ipinnovative.com" className="text-blue-600 hover:underline font-normal">info@ipinnovative.com</a></p>
            <p className="font-bold">Support: <a href="mailto:support@ipinnovative.com" className="text-blue-600 hover:underline font-normal">support@ipinnovative.com</a></p>
            <p className="font-bold">Web: <a href="https://www.ipinnovative.com" className="text-blue-600 hover:underline font-normal">www.ipinnovative.com</a></p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ContactUs;