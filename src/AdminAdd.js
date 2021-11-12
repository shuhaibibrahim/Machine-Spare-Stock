import React, { useState } from 'react'
import { db, storage } from "./firebase_config";
import { ref, set, push } from "firebase/database";
import { ref as sref, uploadBytes, getDownloadURL } from "firebase/storage";

function AdminAdd() {
    const [spare, setSpare] = useState({
        code:"",
        partName:"",
        partNumber:"",
        nickName:"",
        spec:"",
        qty:"",
        unit:"",
        value:"",
        origin:"",
        machine:"",
        remarks:"",
        image:"",
        life:0,
        minStock:0,
        id:""
    })
    const [imageFile, setImageFile] = useState("")
    const [Modal, setModal] = useState(<div/>)
    const [updateLoad, setUpdateLoad] = useState(false)

    const pushToDatabase = () => {
        // console.log(user);const db = getDatabase();
            setUpdateLoad(true)

            const spareRef = ref(db, `spares/`);
            const newSpareRef = push(spareRef);

            const storageRef = sref(storage,`spares/${newSpareRef.key}`);

            uploadBytes(storageRef, imageFile)
            .then((snapshot) => {
                console.log('Uploaded a blob or file!', snapshot);

                getDownloadURL(sref(storage, `spares/${newSpareRef.key}`))
                .then((url) => {
                    console.log(url)
                    // setSpare({...spare, image:url, id:newSpareRef.key})

                    set(newSpareRef, {
                        ...spare,
                        image:url, 
                        id:newSpareRef.key
                    })
                    .then((ref)=>{
                        setUpdateLoad(false)
                        alert("Successfully updated")
                        console.log(ref)
        
                        setSpare({
                            code:"",
                            partName:"",
                            partNumber:"",
                            nickName:"",
                            spec:"",
                            qty:"",
                            localQty:"",
                            localVendor:"",
                            unit:"",
                            value:"",
                            origin:"",
                            machine:"",
                            remarks:"",
                            image:"",
                            life:0,
                            minStock:0
                        })
                        setModal(<div/>)
                    })
                    .catch((error)=>{
                        alert("Error while saving data : ",error)
                    })
                })
                .catch((error) => {
                    console.log("error here : ",error)
                });
            })
            .catch(error=>{
                alert("Couldnt save data!");
                console.log(error)
                return;
            })
    }

    const backdropClickHandler = (event) => {
        if (event.target === event.currentTarget) {
            setModal(<div/>)
        }
    }

    const RenderModal = (e) => {
        e.preventDefault()
        console.log(spare)
        setModal(
            <div onClick={backdropClickHandler} className="bg-white z-20 bg-opacity-95 fixed inset-0 flex justify-center items-center">
                <div className="flex flex-col bg-blue-700 text-white h-xl w-8/12 rounded-xl">
                    <div className="flex flex-row justify-end px-8 pt-3 ">
                        <svg onClick={()=>{setModal(<div/>)}} xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-black hover:text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>

                    <div className="w-full h-lg px-8 py-4 text-white flex flex-row bg-blue-700 justify-between">    
                        <div className="mr-3 overflow-y-scroll flex flex-col space-y-4 items-start w-8/12">
                            <div className="w-full grid grid-cols-3">
                                <div className="text-left font-bold">CODE</div>
                                <div className="text-center font-bold">:</div>
                                <div className="text-left font-semibold">{spare.code}</div>
                            </div>
                            <div className="w-full grid grid-cols-3">
                                <div className="text-left font-bold">PART NAME</div>
                                <div className="text-center font-bold">:</div>
                                <div className="text-left font-semibold">{spare.partName}</div>
                            </div>
                            <div className="w-full grid grid-cols-3">
                                <div className="text-left font-bold">MACHINE</div>
                                <div className="text-center font-bold">:</div>
                                <div className="text-left font-semibold">{spare.machine}</div>
                            </div>
                            <div className="w-full grid grid-cols-3">
                                <div className="text-left font-bold">PART NUMBER</div>
                                <div className="text-center font-bold">:</div>
                                <div className="text-left font-semibold">{spare.partNumber}</div>
                            </div>
                            <div className="w-full grid grid-cols-3">
                                <div className="text-left font-bold">NICKNAME</div>
                                <div className="text-center font-bold">:</div>
                                <div className="text-left font-semibold">{spare.nickName}</div>
                            </div>
                            <div className="w-full grid grid-cols-3">
                                <div className="text-left font-bold">SPECIFICATION</div>
                                <div className="text-center font-bold">:</div>
                                <div className="text-left font-semibold">{spare.spec}</div>
                            </div>
                            <div className="w-full grid grid-cols-3">
                                <div className="text-left font-bold">LOCAL QUANTITY</div>
                                <div className="text-center font-bold">:</div>
                                <div className="text-left font-semibold">{spare.localQty}</div>
                            </div>
                            <div className="w-full grid grid-cols-3">
                                <div className="text-left font-bold">LOCAL VENDOR</div>
                                <div className="text-center font-bold">:</div>
                                <div className="text-left font-semibold">{spare.localVendor}</div>
                            </div>
                            <div className="w-full grid grid-cols-3">
                                <div className="text-left font-bold">UNIT</div>
                                <div className="text-center font-bold">:</div>
                                <div className="text-left font-semibold">{spare.unit}</div>
                            </div>
                            <div className="w-full grid grid-cols-3">
                                <div className="text-left font-bold">VALUE (INR)</div>
                                <div className="text-center font-bold">:</div>
                                <div className="text-left font-semibold">{spare.value}</div>
                            </div>
                            <div className="w-full grid grid-cols-3">
                                <div className="text-left font-bold">TOTAL VALUE</div>
                                <div className="text-center font-bold">:</div>
                                <div className="text-left font-semibold">
                                    {spare.value!==""&&spare.qty!==""?parseInt(spare.value)*parseInt(spare.qty):0}
                                </div>
                            </div>
                            <div className="w-full grid grid-cols-3">
                                <div className="text-left font-bold">ORIGIN</div>
                                <div className="text-center font-bold">:</div>
                                <div className="text-left font-semibold">{spare.origin}</div>
                            </div>
                            <div className="w-full grid grid-cols-3">
                                <div className="text-left font-bold">REMARKS</div>
                                <div className="text-center font-bold">:</div>
                                <div className="text-left font-semibold">{spare.remarks}</div>
                            </div>
                            <div className="w-full grid grid-cols-3">
                                <div className="text-left font-bold">QUANTITY</div>
                                <div className="text-center font-bold">:</div>
                                <div className="text-left font-semibold">{spare.qty}</div>
                            </div>
                            <div className="w-full grid grid-cols-3">
                                <div className="text-left font-bold">LIFE (in days)</div>
                                <div className="text-center font-bold">:</div>
                                <div className="text-left font-semibold">{spare.life}</div>
                            </div>
                            <div className="w-full grid grid-cols-3">
                                <div className="text-left font-bold">MINIMUM STOCK</div>
                                <div className="text-center font-bold">:</div>
                                <div className="text-left font-semibold">{spare.minStock}</div>
                            </div>
                        </div>
                        
                        <div className="flex flex-col space-y-4 w-4/12 justify-between items-center">
                            <div className="flex h-full w-full rounded-2xl bg-blue-100 justify-center items-center">
                                <img className="h-64 w-56 rounded-xl" src={imageFile?URL.createObjectURL(imageFile):""} alt="imageq1" />
                            </div>

                            <div className="flex flex-row justify-end w-full">
                                <button 
                                    className="p-3 w-7/12 ring-4 ring-red-700 bg-red-600 hover:bg-red-500 rounded-2xl text-white font-semibold"
                                    onClick={e=>{pushToDatabase()}}
                                >
                                        Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div>
            {updateLoad&&(<div className="bg-white z-40 bg-opacity-95 fixed inset-0 flex justify-center items-center">
                    <div class="w-full h-full flex justify-center items-center space-x-5 mt-24">
                        <div
                            className="animate-spin rounded-full h-8 w-8 border-b-4 border-blue-500"
                        />
                    </div>
                </div>)}
                
            {Modal}
            <div className="p-12 flex flex-row items-center bg-blue-200 filter drop-shadow-lg w-full">
                <div className="font-bold text-5xl w-full text-center text-gray-900">SPARE ADD</div>
            </div>

            <div className="flex flex-col justify-center items-center mb-4">
                <form className="flex flex-col items-center justify-center w-10/12">
                    <div className="py-4 px-4 bg-blue-100 flex flex-row items-center justify-center space-x-3 rounded-2xl w-full">
                        <div className="py-4 px-4 bg-blue-300 flex flex-col items-center justify-center space-y-2 rounded-2xl w-full">
                            <div className="p-1 pl-3 pb-2 bg-blue-100 rounded-xl w-full">
                                <label htmlFor="code">
                                    <div className="w-full text-left">Code </div>
                                </label>
                                <input className="pl-3 focus:outline-none h-8 w-full rounded-xl" type="text" id="code" value={spare.code} onChange={(e)=>{setSpare({...spare, code:e.target.value})}} />
                            </div>

                            <div className="p-1 pl-3 pb-2 bg-blue-100 rounded-xl w-full">
                                <label htmlFor="partName">
                                    <div className="w-full text-left">Part Name </div>
                                </label>
                                <input className="pl-3 focus:outline-none h-8 w-full rounded-xl" type="text" id="partName" value={spare.partName} onChange={(e)=>{setSpare({...spare, partName:e.target.value})}} />
                            </div>

                            <div className="p-1 pl-3 pb-2 bg-blue-100 rounded-xl w-full">
                                <label htmlFor="partNumber">
                                    <div className="w-full text-left">Part Number </div>
                                </label>
                                <input className="pl-3 focus:outline-none h-8 w-full rounded-xl" type="text" id="partNumber" value={spare.partNumber} onChange={(e)=>{setSpare({...spare, partNumber:e.target.value})}} />
                            </div>

                            <div className="p-1 pl-3 pb-2 bg-blue-100 rounded-xl w-full">
                                <label htmlFor="nickName">
                                    <div className="w-full text-left">Nickname </div>
                                </label>
                                <input className="pl-3 focus:outline-none h-8 w-full rounded-xl" type="text" id="nickName" value={spare.nickName} onChange={(e)=>{setSpare({...spare, nickName:e.target.value})}} />
                            </div>

                            <div className="p-1 pl-3 pb-2 bg-blue-100 rounded-xl w-full">
                                <label htmlFor="spec">
                                    <div className="w-full text-left">Specification </div>
                                </label>
                                <input className="pl-3 focus:outline-none h-8 w-full rounded-xl" type="text" id="spec" value={spare.spec} onChange={(e)=>{setSpare({...spare, spec:e.target.value})}} />
                            </div>

                            <div className="p-1 pl-3 pb-2 bg-blue-100 rounded-xl w-full">
                                <label htmlFor="qty">
                                    <div className="w-full text-left">Quantity </div>
                                </label>
                                <input className="pl-3 focus:outline-none h-8 w-full rounded-xl" type="text" id="qty" value={spare.qty} onChange={(e)=>{setSpare({...spare, qty:e.target.value})}} />
                            </div>

                            <div className="p-1 pl-3 pb-2 bg-blue-100 rounded-xl w-full">
                                <label htmlFor="localQty">
                                    <div className="w-full text-left">Local Quantity </div>
                                </label>
                                <input className="pl-3 focus:outline-none h-8 w-full rounded-xl" type="number" id="localQty" value={spare.localQty} onChange={(e)=>{setSpare({...spare, localQty:e.target.value})}} />
                            </div>

                            <div className="p-1 pl-3 pb-2 bg-blue-100 rounded-xl w-full">
                                <label htmlFor="localVendor">
                                    <div className="w-full text-left">Local Vendor </div>
                                </label>
                                <input className="pl-3 focus:outline-none h-8 w-full rounded-xl" type="text" id="localVendor" value={spare.localVendor} onChange={(e)=>{setSpare({...spare, localVendor:e.target.value})}} />
                            </div>
                            
                        </div>

                        <div className="py-4 px-4 bg-blue-300 flex flex-col items-center justify-center space-y-2 rounded-2xl w-full">
                            
                            <div className="p-1 pl-3 pb-2 bg-blue-100 rounded-xl w-full">
                                <label htmlFor="unit">
                                    <div className="w-full text-left">Unit </div>
                                </label>
                                <input className="pl-3 focus:outline-none h-8 w-full rounded-xl" type="text" id="unit" value={spare.unit} onChange={(e)=>{setSpare({...spare, unit:e.target.value})}} />
                            </div>

                            <div className="p-1 pl-3 pb-2 bg-blue-100 rounded-xl w-full">
                                <label htmlFor="value">
                                    <div className="w-full text-left">Value </div>
                                </label>
                                <input className="pl-3 focus:outline-none h-8 w-full rounded-xl" type="text" id="value" value={spare.value} onChange={(e)=>{setSpare({...spare, value:e.target.value})}} />
                            </div>

                            <div className="p-1 pl-3 pb-2 bg-blue-100 rounded-xl w-full">
                                <label htmlFor="origin">
                                    <div className="w-full text-left">Origin </div>
                                </label>
                                <input className="pl-3 focus:outline-none h-8 w-full rounded-xl" type="text" id="origin" value={spare.origin} onChange={(e)=>{setSpare({...spare, origin:e.target.value})}} />
                            </div>

                            <div className="p-1 pl-3 pb-2 bg-blue-100 rounded-xl w-full">
                                <label htmlFor="machine">
                                    <div className="w-full text-left">Machine </div>
                                </label>
                                <input className="pl-3 focus:outline-none h-8 w-full rounded-xl" type="text" id="machine" value={spare.machine} onChange={(e)=>{setSpare({...spare, machine:e.target.value})}} />
                            </div>

                            <div className="p-1 pl-3 pb-2 bg-blue-100 rounded-xl w-full">
                                <label htmlFor="remarks">
                                    <div className="w-full text-left">Remarks </div>
                                </label>
                                <input className="pl-3 focus:outline-none h-8 w-full rounded-xl" type="text" id="remarks" value={spare.remarks} onChange={(e)=>{setSpare({...spare, remarks:e.target.value})}} />
                            </div>

                            <div className="p-1 pl-3 pb-2 bg-blue-100 rounded-xl w-full">
                                <label htmlFor="life">
                                    <div className="w-full text-left">Life (in days)</div>
                                </label>
                                <input className="pl-3 focus:outline-none h-8 w-full rounded-xl" type="number" id="life" value={spare.life} onChange={(e)=>{setSpare({...spare, life:e.target.value})}} />
                            </div>

                            <div className="p-1 pl-3 pb-2 bg-blue-100 rounded-xl w-full">
                                <label htmlFor="minStock">
                                    <div className="w-full text-left">Minimum Stock</div>
                                </label>
                                <input className="pl-3 focus:outline-none h-8 w-full rounded-xl" type="number" id="minStock" value={spare.minStock} onChange={(e)=>{setSpare({...spare, minStock:e.target.value})}} />
                            </div>

                            <div className="p-1 pl-3 pb-2 bg-blue-100 rounded-xl w-full">
                                <label>
                                    <div className="text-left w-full" >Image {imageFile?`: ${imageFile.name}`:""} </div>
                                    <div className="
                                        w-full
                                        flex flex-row
                                        space-x-3
                                        items-center
                                        justify-center
                                        px-3
                                        h-8
                                        bg-white
                                        rounded-xl
                                        shadow-md
                                        tracking-wide
                                        border border-blue
                                        cursor-pointer
                                        hover:bg-purple-600 hover:text-white
                                        text-purple-600
                                        ease-linear
                                        transition-all
                                        duration-150
                                    ">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z" />
                                            <path d="M9 13h2v5a1 1 0 11-2 0v-5z" />
                                        </svg>
                                        <span class="text-base leading-normal uppercase">Select a file (max 45kb)</span>
                                        <input 
                                            id="image" 
                                            type="file" 
                                            class="hidden" 
                                            onChange={e=>{
                                                if(e.target.files[0].size<=46080)
                                                    setImageFile(e.target.files[0])
                                                else    
                                                    alert("File size more than 45kb")
                                            }} 
                                        />
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-row justify-end w-full px-4">
                        <input 
                            type="submit" 
                            className="p-3 rounded-3xl bg-green-400 w-2/12 mt-2 text-white font-bold " 
                            value="Add Spare"
                            onClick={RenderModal}
                        />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AdminAdd
