import React, { useEffect, useState } from 'react'
import { apiCall } from 'utils/apiClient'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { AiFillCloseCircle } from 'react-icons/ai';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { Toaster, toast } from 'react-hot-toast';
import InstallmentComponent from './component/InstallmentComponent';
import TimelineComponent from './component/TimelineComponent';
import CategorySelection from './component/CategorySelection';
import ItemsComponent from './component/ItemsComponent';

const CustomerEditQuotation = () => {
  const location = useLocation();
  const quotation_id = location.state?.id
  const type = location.state?.type

  const [titleinputFields, setTitleInputFields] = useState([]);
  const [otherFormData, setOtherFormData] = useState({});
  const [loader, setLoader] = useState(false)
  const [total, setTotal] = useState(0);
  const [sgst, setSGST] = useState(0);
  const [cgst, setCGST] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [discount, setDiscount] = useState(0)
  const [discountAmount, setDiscountAmount] = useState(0)
  const [discountDescription, setDiscountDescription] = useState('')
  const [selectedSubcategories, setSelectedSubcategories] = useState({});
  const [timeline, setTimeline] = useState([]);
  const [installments, setInstallments] = useState([]);
  const [errors, setErrors] = useState({
    customer_name: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    setLoader(true)
    ApiFetch()
  }, [])


  const ApiFetch = async () => {
    try {
      const result = await apiCall({
        endpoint: `quotation/getById/${quotation_id}`,
        method: 'GET',
      });
      if (result.status === 200) {
        let data = result?.data
        setInstallments(result?.data?.installments)
        setTimeline(result?.data?.timelines)
        setSelectedSubcategories(JSON.parse(result?.data?.mark_list) ?? {})
        setTitleInputFields(result?.data?.items)
        setOtherFormData({ customer_name: data?.customer_name, phone: data?.phone, address: data?.address })
        setTotal(data?.total)
        setDiscount(data?.discount)
        setDiscountAmount(data?.discount_amount)
        setDiscountDescription(data?.discount_desc)
        setSGST(data?.sgst)
        setCGST(data?.cgst)
        setGrandTotal(data?.grand_total)
        setLoader(false)
      }
    } catch (error) {
      console.log('error', error);
    }
  }

  useEffect(() => {
    const totalAmount = titleinputFields.reduce((acc, item) => {
      return acc + item.subfiled.reduce((sum, subItem) => sum + parseFloat(subItem.amount || 0), 0);
    }, 0);
    setTotal(totalAmount.toFixed(2));
    // Calculate discount amount (if discount is in percentage)
    const discountAmount = (parseFloat(total) * parseFloat(discount) / 100) || 0; // Subtract discount from total
    setDiscountAmount(discountAmount)
    // Subtract the discount amount from the total to get the discounted total
    const discountedTotal = parseFloat(total) - discountAmount || 0;
    // Calculate SGST (9% of discounted total)
    const calculatedSGST = (discountedTotal * 0.09).toFixed(2); // 9% of discounted total

    // Calculate CGST (9% of discounted total)
    const calculatedCGST = (discountedTotal * 0.09).toFixed(2); // 9% of discounted total

    // Calculate Grand Total (Discounted Total + SGST + CGST)
    const calculatedGrandTotal = (discountedTotal + parseFloat(calculatedSGST) + parseFloat(calculatedCGST)).toFixed(2);
    setInstallments((prev) =>
      prev.map((inst) => ({
        ...inst,
        amount: ((calculatedGrandTotal * inst.percentage) / 100).toFixed(2),
      }))
    );
    // Update the states
    setSGST(calculatedSGST);
    setCGST(calculatedCGST);
    setGrandTotal(calculatedGrandTotal);

  }, [total, discount, titleinputFields]);


  const validateForm = () => {
    const newErrors = {};

    if (!otherFormData.customer_name) {
      newErrors.customer_name = "Customer Name is required";
    }
    if (!otherFormData.phone) {
      newErrors.phone = "Phone No is required";
    }
    if (!otherFormData.address) {
      newErrors.address = "Address is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOnUpdate = async (e) => {
    setLoader(true)
    e.preventDefault()
    let admin_id = localStorage.getItem("id")
    if (validateForm()) {
      // Validate Installments Dates
      const invalidInstallments = installments.some(inst => !inst.due_date);
      // if (invalidInstallments) {
      //   toast.error("All installment dates are required.");
      //   return;
      // }

      // Validate Timeline Days
      const invalidTimeline = timeline.some(item => !item.days);
      if (invalidTimeline) {
        toast.error("All timeline days are required.");
        return;
      }


      // Validate TitleinputFields (Title, Description, Size, Type, Rate)
      const invalidTitleInputFields = titleinputFields.some(field =>
        !field.title || // Check if title is missing
        field.subfiled.some(subfield =>
          !subfield.description ||
          !subfield.size ||
          !subfield.type ||
          !subfield.rate // Check for missing required fields in subfields
        )
      );

      if (invalidTitleInputFields) {
        toast.error("All fields (Title, Description, Size, Type, Rate) are required.");
        return;
      }

      try {
        const result = await apiCall({
          endpoint: `quotation/update/${quotation_id}`,
          method: 'PUT',
          data: {
            customer_name: otherFormData.customer_name,
            phone: otherFormData.phone,
            address: otherFormData.address,
            items: titleinputFields,
            mark_list: JSON.stringify(selectedSubcategories),
            total: total,
            discount: discount,
            discountAmount: discountAmount,
            discountDesc: discountDescription,
            sgst: sgst,
            cgst: cgst,
            grandTotal: grandTotal,
            installment: installments,
            time_line: timeline,
            created_by: admin_id,
          },
        });
        if (result.status === 200) {
          setLoader(false)
          toast.success("Quotation Updated Successfully")
          setTimeout(() => {
            BackToListQuotation()
          }, 500);
        }
      } catch (error) {
        console.log('error', error);
      }
    }

  }

  const navigate = useNavigate();
  const BackToListQuotation = () => {
    navigate("/listquotation", { state: { type } });
  }

  const RedirectToQuotationform = async (e) => {
    e.preventDefault()
    let admin_id = localStorage.getItem("id")
    if (validateForm()) {
      // Validate Installments Dates
      const invalidInstallments = installments.some(inst => !inst.due_date);
      if (invalidInstallments) {
        toast.error("All installment dates are required.");
        return;
      }

      // Validate Timeline Days
      const invalidTimeline = timeline.some(item => !item.days);
      if (invalidTimeline) {
        toast.error("All timeline days are required.");
        return;
      }


      // Validate TitleinputFields (Title, Description, Size, Type, Rate)
      const invalidTitleInputFields = titleinputFields.some(field =>
        !field.title || // Check if title is missing
        field.subfiled.some(subfield =>
          !subfield.description ||
          !subfield.size ||
          !subfield.type ||
          !subfield.rate // Check for missing required fields in subfields
        )
      );

      if (invalidTitleInputFields) {
        toast.error("All fields (Title, Description, Size, Type, Rate) are required.");
        return;
      }

      try {
        const result = await apiCall({
          endpoint: 'quotation/create',
          method: 'POST',
          data: {
            customer_name: otherFormData.customer_name,
            phone: otherFormData.phone,
            address: otherFormData.address,
            items: JSON.stringify(titleinputFields),
            mark_list: JSON.stringify(selectedSubcategories),
            total: total,
            discount: discount,
            discountAmount: discountAmount,
            discountDesc: discountDescription,
            sgst: sgst,
            cgst: cgst,
            grandTotal: grandTotal,
            installment: JSON.stringify(installments),
            time_line: JSON.stringify(timeline),
            created_by: admin_id,
            type: type,
          },
        });
        if (result.status === 201) {
          toast.success("Quotation Added Successfully")
          setTimeout(() => {
            BackToListQuotation()
          }, 1000);
        }
      } catch (error) {
        console.log('error', error);
      }
    }
  }


  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
      <div className="border-solid border-2 black-indigo-600 mt-6">
        <div style={{ fontSize: 15 }} className="px-8 mt-5">
          Update Quotation
        </div>
        <div className="px-8 mt-6">
          Customer Details
        </div>
        <div className='mt-6'>
          <form className="w-full" onSubmit={handleOnUpdate} >
            <div className="flex ">
              <div className="w-full px-4">
                <label className="text-gray-700 text-xs font-bold mb-2">
                  Customer Name
                </label>
                <input required value={otherFormData?.customer_name} onChange={(e) => setOtherFormData({ ...otherFormData, ["customer_name"]: e.target.value })} className="appearance-none block w-full text-sm  text-gray-400 border border-blue-500 rounded px-1.5 py-1.5 leading-tight focus:outline-none " id="grid-first-name" type="text" placeholder="Full Name" />
                {errors.customer_name && <p className="text-red-500 text-xs">{errors.customer_name}</p>}
              </div>
              <div className="w-full px-4">
                <label className="text-gray-700 text-xs font-bold mb-2">
                  Phone No
                </label>
                <input required value={otherFormData?.phone} onChange={(e) => setOtherFormData({ ...otherFormData, ["phone"]: e.target.value })} className="block w-full text-sm  text-gray-700 border border-gray-200 rounded px-1.5 py-1.5 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-last-name" type="text" placeholder="Phone No" />
                {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
              </div>
            </div>

            <div className="flex">
              <div className="w-full px-4">
                <label className="text-gray-700 text-xs font-bold mb-2">
                  Address
                </label>
                <textarea required value={otherFormData?.address} onChange={(e) => setOtherFormData({ ...otherFormData, ["address"]: e.target.value })} className="appearance-none block w-full  text-sm  text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-password" type="password" placeholder="Address" />
                {errors.address && <p className="text-red-500 text-xs">{errors.address}</p>}
              </div>
            </div>

            <ItemsComponent titleinputFields={titleinputFields} setTitleInputFields={setTitleInputFields} textBoxOpen={true} />

            <div className=" m-4 border-s-4 border-2 border-black-400 ">
              <div className="flex flex-wrap -mx-3 mb-5 px-4">
                <div className="w-full px-4 ">
                  <CategorySelection
                    selectedSubcategories={selectedSubcategories}
                    setSelectedSubcategories={setSelectedSubcategories}
                  />


                  <div className="border-s-4 border-2 border-black-400 mt-6">
                    <div className="flex flex-wrap -mx-3 mb-5 px-4">
                      <div className="w-full px-4">
                        <h2 className="text-gray-700 text-lg font-bold mb-4">Discount</h2>

                        <table className="table-auto w-full text-xs">
                          <tbody>
                            <tr>
                              <td className="py-2 px-4">Discount (%)</td>
                              <td className="py-2 px-4">
                                <input
                                  type="text"
                                  className="bg-gray-50 border w-48 h-10 disabled border-gray-300 rounded-lg block w-1/2 p-2.5"
                                  placeholder="%"
                                  value={discount} // Bind the discount value here
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    const regex = /^[0-9]*$/; // Allow only digits and 'X'
                                    if (regex.test(value)) {
                                      setDiscount(value);
                                    }
                                  }}
                                />
                              </td>
                            </tr>

                            <tr>
                              <td className="py-2 px-4">Description</td>
                              <td className="py-2 px-4">
                                <input
                                  type="text"
                                  className="bg-gray-50 border w-48 h-10 disabled border-gray-300 rounded-lg block w-1/2 p-2.5"
                                  placeholder="Description"
                                  value={discountDescription} // Bind the discount value here
                                  onChange={(e) =>
                                    setDiscountDescription(e.target.value)}
                                />
                              </td>
                            </tr>


                          </tbody>
                        </table>

                      </div>
                    </div>
                  </div>

                  <div className="border-s-4 border-2 border-black-400 mt-6">
                    <div className="flex flex-wrap -mx-3 mb-5 px-4">
                      <div className="w-full px-4">
                        <h2 className="text-gray-700 text-lg font-bold mb-4">Billing Information</h2>

                        <table className="table-auto w-full text-xs">
                          <thead>
                            <tr>
                              <th className="text-left py-2 px-4">Description</th>
                              <th className="text-left py-2 px-4">Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="py-2 px-4">Total</td>
                              <td className="py-2 px-4">
                                <input
                                  type="text"
                                  className="bg-gray-50 border w-48 h-10 disabled border-gray-300 rounded-lg block w-1/2 p-2.5"
                                  placeholder="0"
                                  value={total} // Bind the total value here
                                  disabled
                                />
                              </td>
                            </tr>

                            <tr>
                              <td className="py-2 px-4">Discount ({discount}%)</td>
                              <td className="py-2 px-4">
                                <input
                                  type="text"
                                  className="bg-gray-50 border w-48 h-10 disabled border-gray-300 rounded-lg block w-1/2 p-2.5"
                                  placeholder="%"
                                  value={discountAmount} // Bind the discount value here
                                  // onChange={(e) => setDiscount(e.target.value)}
                                  disabled
                                />
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 px-4">After Discount Total</td>
                              <td className="py-2 px-4">
                                <input
                                  type="text"
                                  className="bg-gray-50 border w-48 h-10 disabled border-gray-300 rounded-lg block w-1/2 p-2.5"
                                  placeholder="%"
                                  value={parseFloat(total) - parseFloat(discountAmount)} // Bind the discount value here
                                  // onChange={(e) => setDiscount(e.target.value)}
                                  disabled
                                />
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 px-4">SGST (9%)</td>
                              <td className="py-2 px-4">
                                <input
                                  type="text"
                                  className="bg-gray-50 border w-48 h-10 disabled border-gray-300 rounded-lg block w-1/2 p-2.5"
                                  placeholder="0"
                                  value={sgst} // Bind the SGST value here
                                  disabled
                                />
                              </td>
                            </tr>

                            <tr>
                              <td className="py-2 px-4">CGST (9%)</td>
                              <td className="py-2 px-4">
                                <input
                                  type="text"
                                  className="bg-gray-50 border w-48 h-10 disabled border-gray-300 rounded-lg block w-1/2 p-2.5"
                                  placeholder="0"
                                  value={cgst} // Bind the CGST value here
                                  disabled
                                />
                              </td>
                            </tr>

                            <tr>
                              <td className="py-2 px-4 font-bold">Total Amount</td>
                              <td className="py-2 px-4 font-bold">
                                <input
                                  type="text"
                                  className="bg-gray-50 border w-48 h-10 disabled border-gray-300 rounded-lg block w-1/2 p-2.5"
                                  placeholder="0"
                                  value={grandTotal} // Bind the final total amount here
                                  disabled
                                />
                              </td>
                            </tr>
                          </tbody>
                        </table>

                      </div>
                    </div>
                  </div>

                  <InstallmentComponent installments={installments} setInstallments={setInstallments} total={0} />

                  <TimelineComponent timeline={timeline} setTimeline={setTimeline} />

                </div>
              </div>

              <div className="m-3 grid grid-cols-3 text-xs  mt-4">

                <div>
                  <button type="button" className=" m-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={BackToListQuotation}>Back</button>

                  <button className="m-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type='submit'
                  >Update</button>

                  <button type='button ' className=" m-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={RedirectToQuotationform}>Make copy</button>
                </div>
              </div>

            </div>

          </form>

        </div>
      </div>

    </DashboardLayout>
  )
}

export default CustomerEditQuotation
