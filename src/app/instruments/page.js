import InnerNav from '@/components/InnerNav'
import React from 'react'
import { createClient } from "@/lib/supabase/server";
import { getuserbyid } from "@/lib/db/Users";
import {
  getallapprovedinstruments,
  getallrequestedinstruments,
  getnumapproved,
  getnumrequested
} from "@/lib/db/Instruments";
import RequestInstrumentapproval from '@/components/RequestInstrumentapproval';
import ApproveInstrument from "@/components/ApproveInstrument";

const page = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const cuser = await getuserbyid(user.id);
  const role = cuser.role_id;

  const numapproved = await getnumapproved();
  const numrequested = await getnumrequested();

  const approvedInstruments = await getallapprovedinstruments();
  const requestedInstruments = await getallrequestedinstruments();

  return (
    <div>
      <InnerNav user = {cuser}/>

      <div className="w-full px-5 sm:px-8 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-white text-3xl font-bold">
            Instruments
          </h1>

          <p className="text-neutral-400 mt-1">
            Manage approved and requested stocks
          </p>
        </div>


        {/* Stats */}
        <div className="flex flex-wrap gap-4 mb-8">

          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl px-6 py-4">
            <p className="text-neutral-500 text-sm">
              Total Allowed
            </p>

            <p className="text-emerald-400 text-2xl font-bold">
              {numapproved}
            </p>
          </div>


          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl px-6 py-4">
            <p className="text-neutral-500 text-sm">
              Total Requested
            </p>

            <p className="text-yellow-400 text-2xl font-bold">
              {numrequested}
            </p>
          </div>

            <div className="ml-auto">
                <RequestInstrumentapproval owner={cuser.role_id === 3}>
                    <button
                        type="button"
                        className=" ml-auto rounded-xl bg-yellow-400 px-5 py-3 font-semibold text-black hover:bg-yellow-300"
                    >
                        + Add Instrument
                    </button>
                </RequestInstrumentapproval>
            </div>
        </div>


        {/* Tables */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


          {/* APPROVED */}
          <div className="order-2 md:order-1 bg-neutral-900 border border-neutral-700 rounded-2xl overflow-hidden">

            <div className="p-5 border-b border-neutral-800">

              <div className="flex items-center justify-between">

                <div>
                  <h2 className="text-white font-semibold text-lg">
                    Approved
                  </h2>

                  <p className="text-neutral-500 text-sm mt-1">
                    Stocks available to traders
                  </p>
                </div>

                <span className="text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full text-sm font-medium">
                  {numapproved}
                </span>

              </div>

            </div>


            <div className="max-h-[500px] overflow-auto">

              {approvedInstruments.length === 0 ? (

                <div className="p-10 text-center">
                  <p className="text-neutral-500">
                    No approved instruments
                  </p>
                </div>

              ) : (

                <table className="w-full text-left text-sm">

                  <thead className="sticky top-0 bg-neutral-800 text-neutral-400 uppercase text-xs">

                    <tr>
                      <th className="p-4">
                        Company
                      </th>

                      <th className="p-4">
                        Symbol
                      </th>
                    </tr>

                  </thead>


                  <tbody className="divide-y divide-neutral-800">

                    {approvedInstruments.map((instrument) => (

                      <tr
                        key={instrument.id}
                        className="hover:bg-neutral-800/50 transition-colors"
                      >

                        <td className="p-4 text-neutral-300">
                          {instrument.company_name}
                        </td>

                        <td className="p-4 font-bold text-emerald-400">
                          {instrument.symbol}
                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              )}

            </div>

          </div>


          {/* REQUESTED */}
          <div className="order-1 md:order-2 bg-neutral-900 border border-neutral-700 rounded-2xl overflow-hidden">

            <div className="p-5 border-b border-neutral-800">

              <div className="flex items-center justify-between">

                <div>
                  <h2 className="text-white font-semibold text-lg">
                    Requested
                  </h2>

                  <p className="text-neutral-500 text-sm mt-1">
                    Stocks awaiting approval
                  </p>
                </div>

                <span className="text-yellow-400 bg-yellow-400/10 px-3 py-1 rounded-full text-sm font-medium">
                  {numrequested}
                </span>

              </div>

            </div>


            <div className="max-h-[500px] overflow-auto">

              {requestedInstruments.length === 0 ? (

                <div className="p-10 text-center">
                  <p className="text-neutral-500">
                    No new requests
                  </p>
                </div>

              ) : (

                <table className="w-full text-left text-sm">

                  <thead className="sticky top-0 bg-neutral-800 text-neutral-400 uppercase text-xs">

                    <tr>

                      <th className="p-4">
                        Company
                      </th>

                      <th className="p-4">
                        Symbol
                      </th>

                      <th className="p-4 text-right">
                        Action
                      </th>

                    </tr>

                  </thead>


                  <tbody className="divide-y divide-neutral-800">

                    {requestedInstruments.map((instrument) => (

                      <tr
                        key={instrument.id}
                        className="hover:bg-neutral-800/50 transition-colors"
                      >

                        <td className="p-4 text-neutral-300">
                          {instrument.company_name}
                        </td>

                        <td className="p-4 font-bold text-yellow-400">
                          {instrument.symbol}
                        </td>

                        <td className="p-4 text-right">

                          <ApproveInstrument
                            id={instrument.id}
                            company={instrument.company_name}
                            symbol={instrument.symbol}
                          />

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              )}

            </div>

          </div>

        </div>

      </div>
    </div>
  )
}

export default page