import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { ref, set, onValue } from "firebase/database";
import { db } from "./firebase_config";
import * as XLSX from 'xlsx';


function SpareView() {
    // const location = useLocation()
    // const {spareData}=location.state
    let history = useHistory();

    const [spareData, setSpareData] = useState([])
    const [Modal, setModal] = useState(<div/>)
    const [search, setSearch] = useState("")
    const [renderItems, setRenderItems] = useState(
        <div className="flex items-center justify-center w-full h-full">
            <div className="text-blue-300 text-5xl">Nothing here !</div>
        </div>
    )

    const [qty, setQty] = useState(0)
    const [loading, setLoading] = useState(true)

    function DownloadExcel() {
        

        // const fields={
        //     "code" : "Code",
        //     "partName" : "Part Name",
        //     "partNumber" : "Part Number"
        // }

        const excelData=spareData.map(item=>{
            return {
                code: item.code,
                machine: item.machine,
                Nickname: item.nickName,
                origin: item.origin,
                partName: item.partName,
                partNumber: item.partNumber,
                qty: item.qty,
                remarks: item.remarks,
                spec: item.spec,
                unit: item.unit,
                value: item.value
            }
        })

        const fileName = 'test.xlsx';
        const Heading=[[
            "Code",
            // "Id",
            // "Image",
            "Machine",
            "Nickname",
            "Origin",
            "Part Name",
            "Part Number",
            "Quantity",
            "Remarks",
            "Specification",
            "Unit",
            "Value",
        ]]

		var ws = XLSX.utils.json_to_sheet(excelData, { origin: 'A2', skipHeader: true });
        var wb = XLSX.utils.book_new();

        XLSX.utils.sheet_add_aoa(ws, Heading);
        
        XLSX.utils.book_append_sheet(wb, ws, "WorksheetName");

		XLSX.writeFile(wb, "sheetjs.xlsx");
    }

    useEffect(() => {
        const spareRef = ref(db, 'spares/');

        onValue(spareRef, (snapshot) => {
            const data = snapshot.val();
            ;

            var spareArray=[];
            for(var key in data)
            {
                spareArray.push(data[key])
            }

            ;

            setSpareData(spareArray);
            setLoading(false);
        });
    }, [])

    const minusQuantity=(item)=>{
        const spareRef = ref(db, `spares/${item.id}`);

            set(spareRef, {
                ...item,
                qty:parseInt(item.qty)>=parseInt(qty)?parseInt(item.qty)-parseInt(qty):0
            })
            .then(()=>{
                alert("Successfully updated")
            })
            .catch((error)=>{
                alert("Error while saving data : ",error)
            })
    }

    const backdropClickHandler = (event) => {
        if (event.target === event.currentTarget) {
            setModal(<div/>)
        }
    }

    const RenderModal=(item)=>{
        setModal(
            <div onClick={backdropClickHandler} className="bg-white z-20 bg-opacity-95 fixed inset-0 flex justify-center items-center">
                <div className="w-8/12 px-8 py-8 text-white h-auto flex flex-row bg-blue-700 rounded-xl justify-between">
                    <div className="flex flex-col space-y-4 items-start w-8/12">
                        <div className="w-full grid grid-cols-2">
                            <div className="text-left font-bold flex flex-row justify-between mr-3">
                                <span>CODE</span> 
                                <span>:</span>
                            </div>
                            {/* <div className="text-center font-bold">:</div> */}
                            <div className="text-left font-semibold">{item.code}</div>
                        </div>

                        <div className="w-full grid grid-cols-2">
                            <div className="text-left font-bold flex flex-row justify-between mr-3">
                                <span>PART NAME</span> 
                                <span>:</span>
                            </div>
                            {/* <div className="text-center font-bold">:</div> */}
                            <div className="text-left font-semibold">{item.partName}</div>
                        </div>

                        <div className="w-full grid grid-cols-2">
                            <div className="text-left font-bold flex flex-row justify-between mr-3">
                                <span>MACHINE</span> 
                                <span>:</span>
                            </div>
                            {/* <div className="text-center font-bold">:</div> */}
                            <div className="text-left font-semibold">{item.machine}</div>
                        </div>

                        <div className="w-full grid grid-cols-2">
                            <div className="text-left font-bold flex flex-row justify-between mr-3">
                                <span>PART NUMBER</span> 
                                <span>:</span>
                            </div>
                            {/* <div className="text-center font-bold">:</div> */}
                            <div className="text-left font-semibold">{item.partNumber}</div>
                        </div>

                        <div className="w-full grid grid-cols-2">
                            <div className="text-left font-bold flex flex-row justify-between mr-3">
                                <span>NICKNAME</span> 
                                <span>:</span>
                            </div>
                            {/* <div className="text-center font-bold">:</div> */}
                            <div className="text-left font-semibold">{item.nickName}</div>
                        </div>

                        <div className="w-full grid grid-cols-2">
                            <div className="text-left font-bold flex flex-row justify-between mr-3">
                                <span>SPECIFICATION</span> 
                                <span>:</span>
                            </div>
                            {/* <div className="text-center font-bold">:</div> */}
                            <div className="text-left font-semibold">{item.spec}</div>
                        </div>

                        <div className="w-full grid grid-cols-2">
                            <div className="text-left font-bold flex flex-row justify-between mr-3">
                                <span>VALUE (INR)</span> 
                                <span>:</span>
                            </div>
                            {/* <div className="text-center font-bold">:</div> */}
                            <div className="text-left font-semibold">{item.value}</div>
                        </div>

                        <div className="w-full grid grid-cols-2">
                            <div className="text-left font-bold flex flex-row justify-between mr-3">
                                <span>TOTAL VALUE</span> 
                                <span>:</span>
                            </div>
                            {/* <div className="text-center font-bold">:</div> */}
                            <div className="text-left font-semibold">{parseInt(item.value)*parseInt(item.qty)}</div>
                        </div>

                        <div className="w-full grid grid-cols-2">
                            <div className="text-left font-bold flex flex-row justify-between mr-3">
                                <span>ORIGIN</span> 
                                <span>:</span>
                            </div>
                            {/* <div className="text-center font-bold">:</div> */}
                            <div className="text-left font-semibold">{item.origin}</div>
                        </div>

                        <div className="w-full grid grid-cols-2">
                            <div className="text-left font-bold flex flex-row justify-between mr-3">
                                <span>REMARKS</span> 
                                <span>:</span>
                            </div>
                            {/* <div className="text-center font-bold">:</div> */}
                            <div className="text-left font-semibold">{item.remarks}</div>
                        </div>

                        <div className="w-full grid grid-cols-2">
                            <div className="text-left font-bold flex flex-row justify-between mr-3">
                                <span>Quantity</span> 
                                <span>:</span>
                            </div>
                            {/* <div className="text-center font-bold">:</div> */}
                            <div className="text-left font-semibold">{item.qty}</div>
                        </div>

                    </div>
                    <div className="flex flex-col space-y-4 w-4/12 justify-between items-center">
                        <div className="flex h-full w-full rounded-2xl bg-blue-100 justify-center items-center">
                            <img className="h-64 w-56 rounded-xl" src={item.image} alt="imageq1" />
                        </div>

                        {/* <div className="flex flex-col space-y-4 w-full">
                            <div className="w-full text-left font-bold">Take quantity : </div>
                            <div className="flex flex-row w-full justify-between">
                                <input 
                                    id="qty"
                                    type="number"
                                    name="qty"
                                    defaultValue={0}
                                    min={0}
                                    onChange={(e)=>{setQty(parseInt(e.target.value))}} 
                                    // value={qty}
                                    className="w-3/12 text-black pl-2 rounded-xl ring-4 ring-blue-900 focus:outline-none"
                                    // className="text-black"
                                />
                                <button 
                                    onClick={()=>{minusQuantity(item)}}
                                    className="p-3 w-8/12 ring-4 ring-red-900 bg-red-600 hover:bg-red-800 rounded-xl text-white font-semibold"
                                >Update
                                </button>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
        )
    }

    useEffect(() => {
        if(search==="")
            setRenderItems(spareData.map((item, index)=><RenderItem item={item} index={index}/>))
        else
        {
            const keys=["code","partName", "machine", "partNumber", "nickName", "spec", "origin"]
            var items=spareData.filter((item,index)=>{
                // 
                var found=0;
                keys.forEach(key=>{
                    if(item[key].includes(search))
                    {
                        
                        found=1;
                    }
                })
                return found===1
            })

            
            if(items.length>0)
                setRenderItems(items.map((item, index)=><RenderItem item={item} index={index}/>))
            else
                setRenderItems(        
                    <div className="flex items-center justify-center w-full h-full">
                        <div className="text-blue-300 text-5xl">Nothing here !</div>
                    </div>
                )
        }
    }, [search, spareData])

    const RenderItem=({item, index})=>{
        
        return (
            <div key={index} className="w-10/12 p-2 grid grid-cols-8">
                <div className="flex items-center justify-center">
                    <div className="font-semibold bg-gray-300 p-5 rounded-xl w-10/12 break-all">{item.code}</div>
                </div>

                <div className="flex items-center justify-center">
                    <div className="font-semibold bg-gray-300 p-5 rounded-xl w-10/12 break-all">{item.partName}</div>
                </div>

                <div className="flex items-center justify-center">
                    <div className="font-semibold bg-gray-300 p-5 rounded-xl w-10/12 break-all">{item.partNumber}</div>
                </div>

                <div className="flex items-center justify-center">
                    <div className="font-semibold bg-gray-300 p-5 rounded-xl w-10/12 break-all">{item.nickName}</div>
                </div>

                <div className="flex items-center justify-center">
                    <div className="font-semibold bg-gray-300 p-5 rounded-xl w-10/12 break-all">{item.spec}</div>
                </div>

                <div className="flex items-center justify-center">
                    <div className="font-semibold bg-gray-300 p-5 rounded-xl w-10/12 break-all">{item.machine}</div>
                </div>

                <div className="flex items-center justify-center">
                    <div 
                        className="font-semibold bg-blue-600 p-3 rounded-3xl w-10/12 break-all text-white hover:bg-blue-800"
                        onClick={()=>{RenderModal(item)}}
                    >View</div>
                </div>

                <div className="flex items-center justify-center">
                    <div 
                        className="font-semibold bg-green-600 p-3 rounded-3xl w-10/12 break-all text-white hover:bg-green-800"
                        onClick={()=>{
                            history.push({
                                pathname: "/sparehistory",
                                state: {spareId:item.id} 
                            });
                        }}
                    >History</div>
                </div>
            </div>
        )
    }

    return (
        <div className="h-full">
            {Modal}
            <div className="h-5/12 pt-12 pb-6 flex flex-col items-center bg-blue-200 filter drop-shadow-lg w-full">
                <div className="font-bold text-5xl w-full text-center text-gray-900">SPARE VIEW</div>

                <div className="flex flex-row space-x-3 w-full items-center justify-center mt-5">
                    <input 
                        value={search} 
                        onChange={e=>{setSearch(e.target.value)}} 
                        type="text" 
                        className="rounded-3xl h-10 w-5/12 p-3 pl-4 focus:outline-none" 
                        placeholder="Search by keyword"
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>

                <div className="flex flex-row space-x-6 mt-6">
                    <Link to="/sparehistory"
                        className="bg-yellow-400 text-sm font-bold text-white p-4 rounded-3xl"
                        onClick={()=>{}}
                    >
                            VIEW HISTORY
                    </Link>

                    <button
                        className="bg-green-400 text-sm font-bold text-white p-4 rounded-3xl"
                        onClick={()=>{DownloadExcel(spareData)}}
                    >
                            EXPORT EXCEL
                    </button>
                </div>
            </div>

            <div className="mt-10 mb-10 flex flex-col h-full space-y-2 items-center justify center items-center">
                <div className="w-10/12 p-3 grid grid-cols-8 border-2 border-black divide-x-2 divide-black divide-solid rounded-xl">
                    <div className="font-bold">Code</div>
                    <div className="font-bold">Part Name</div>
                    <div className="font-bold">Part Number</div>
                    <div className="font-bold">Nickname</div>
                    <div className="font-bold">Specification</div>
                    <div className="font-bold">Machine</div>
                </div>
                <div className="w-full h-full mt-24" >
                {
                    loading && 
                    (
                        <div class="w-full h-full flex justify-center items-center space-x-5 mt-24">
                            <div
                                className="animate-spin rounded-full h-8 w-8 border-b-4 border-blue-500"
                            />
                            {/* <div
                                className="animate-spin rounded-full h-8 w-8 border-b-4 border-red-600"
                            />
                            <div
                                className="animate-spin rounded-full h-8 w-8 border-b-4 border-yellow-500"
                            />
                            <div
                                className="animate-spin rounded-full h-8 w-8 border-b-4 border-green-500"
                            /> */}
                        </div>
                    )
                }
                </div>
                {renderItems}
            </div>
        </div>

    )
}

export default SpareView
