import React, { useEffect, useState } from 'react'
import { ref, set, onValue, push } from "firebase/database";
import { db, storage } from "./firebase_config";
import { ref as sref, uploadBytes, getDownloadURL } from "firebase/storage";
import { fieldKeys, fieldHeadings } from './Requirements';

function AdminEdit() {
    // const location = useLocation()
    // const {spareData}=location.state

    const [spareData, setSpareData] = useState([])
    
    const [modalToggle, setModalToggle] = useState(false)
    const [Modal, setModal] = useState(<div/>)
    const [modalItem, setModalItem] = useState({})

    const [updateLoad, setUpdateLoad] = useState(false)

    const [imageFile, setImageFile] = useState("")

    const [search, setSearch] = useState("")
    const [renderItems, setRenderItems] = useState(
        <div className="flex items-center justify-center w-full h-full">
            <div className="text-blue-300 text-5xl">Nothing here !</div>
        </div>
    )

    const [notInclude, setNotInclude]=useState({
        "totalQty":true,
        "totalValue":true
    })

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const spareRef = ref(db, 'spares/');

        onValue(spareRef, (snapshot) => {
            const data = snapshot.val();
            console.log("data : ",data);

            var spareArray=[];
            
            for(var key in data)
            {
                var item=data[key]
                var qty=item.qty||0
                var localQty=item.localQty||0
                var servQty=item.servQty||0
    
                var ogValue=item.value||0
                var localValue=item.localValue||0
    
                item["totalQty"]=parseInt(qty)+parseInt(localQty)+parseInt(servQty)
                item["totalValue"]=(parseFloat(qty)*parseFloat(ogValue)+parseFloat(localQty)*parseFloat(localValue)).toPrecision(10)
                spareArray.push(item)
            }

            setSpareData(spareArray);
            setLoading(false);
        });
    }, [])


    const backdropClickHandler = (event) => {
        if (event.target === event.currentTarget) {
            setModalToggle(false)
            setImageFile("")
        }
    }

    const pushToDatabase = (item) => {
        // console.log(user);const db = getDatabase();
            setUpdateLoad(true)

            const spareRef = ref(db, `spares/${item.id}`);
            const storageRef = sref(storage,`spares/${item.id}`);

            const historyRef = ref(db, `history/${item.id}`);
            const newHistoryRef=push(historyRef)

            var oldQty=item.qty

            if(imageFile!=="")
            {
                uploadBytes(storageRef, imageFile)
                .then((snapshot) => {
                    console.log('Uploaded a blob or file!', snapshot);
    
                    getDownloadURL(sref(storage, `spares/${item.id}`))
                    .then((url) => {
                        console.log(url)
                        // setSpare({...spare, image:url, id:newSpareRef.key})
    
                        set(spareRef, {
                            ...modalItem,
                            image:url
                        })
                        .then((ref)=>{
                            var currentDate=new Date().toLocaleString('en-GB')
                            // console.log(currentDate)
                            //pushing histoty
                            set(newHistoryRef, {
                                // spareId: item.id,
                                ...item,
                                initialQty: oldQty,
                                edited: "edited",
                                date: currentDate
                            })
                            .then(()=>{
                                setUpdateLoad(false)
                                setModal(<div/>)
                                alert("Successfully updated")
                            })
                            .catch((error)=>{
                                alert("Error while saving data : ",error)
                            })
                            console.log(ref)

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
            else
            {
                set(spareRef, {
                    ...modalItem,
                })
                .then((ref)=>{
                    var currentDate=new Date().toLocaleString()
                    // console.log(currentDate)
                    //pushing histoty
                    set(newHistoryRef, {
                        // spareId: item.id,
                        ...item,
                        initialQty: oldQty,
                        edited: "edited", 
                        date: currentDate
                    })
                    .then(()=>{
                        setUpdateLoad(false)
                        setModal(<div/>)
                        alert("Successfully updated")
                    })
                    .catch((error)=>{
                        alert("Error while saving data : ",error)
                    })

                })
                .catch((error)=>{
                    alert("Error while saving data : ",error)
                })
            }
    }

    const RenderModal=(item)=>{
        setModal(
            <div onClick={backdropClickHandler} className="bg-white z-20 bg-opacity-95 fixed inset-0 flex justify-center items-center">
                <div className="flex flex-col bg-blue-700 text-white h-xl w-8/12 rounded-xl">
                    <div className="flex flex-row justify-end px-8 pt-3 ">
                        <svg onClick={()=>{setModalToggle(false)}} xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-black hover:text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>

                    <div className="w-full h-lg px-8 py-4 text-white flex flex-row bg-blue-700 justify-between">    
                        <div className="mr-3 overflow-y-scroll flex flex-col space-y-4 items-start w-8/12">
                            
                            {fieldHeadings.map((heading,index)=>
                                !(fieldKeys[index].split(":")[0] in notInclude)&&
                                (
                                <div key={index} className="w-full grid grid-cols-2">
                                    <div className="text-left font-bold flex flex-row justify-between mr-3">
                                        <span>{heading}</span> 
                                        <span>:</span>
                                    </div>
                                    {/* <div className="text-center font-bold">:</div> */}
                                    <input 
                                        type={fieldKeys[index].split(":")[1]} 
                                        id={index} 
                                        value={modalItem[fieldKeys[index].split(":")[0]]}
                                        onChange={(e)=>{setModalItem(
                                                {
                                                    ...modalItem,
                                                    [fieldKeys[index].split(":")[0]]:e.target.value
                                                }
                                            )
                                        }}
                                        className="w-10/12 pl-3 text-black text-sm rounded-3xl focus:outline-none focus:ring-blue-500 focus:ring-2"
                                    />
                                </div>
                            ))}

                        </div>
                        <div className="flex flex-col space-y-4 w-4/12 justify-between items-center">
                            <div className="flex h-full w-full rounded-2xl bg-blue-100 justify-center items-center">
                                {/* <img className="h-64 w-56 rounded-xl" src={modalItem.image} alt="imageq1" /> */}
                                <img className="h-64 w-56 rounded-xl" src={imageFile?URL.createObjectURL(imageFile):modalItem.image} alt="imageq1" />
                            </div>

                            <label className="w-full">
                                <div className="text-left w-full" >Image {imageFile?`: ${imageFile.name}`:""} </div>
                                <div className="
                                    w-full
                                    flex flex-row
                                    space-x-3
                                    items-center
                                    justify-center
                                    px-3
                                    py-7
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
                                    <div class="text-base leading-normal uppercase flex flex-col justify-center items-center">
                                        <span>Select a file</span>
                                        <span>(Max 45kb)</span>
                                    </div>
                                    <input 
                                        id="image" 
                                        type="file" 
                                        class="hidden" 
                                        onChange={e=>{
                                            if(e.target.files[0])
                                            {
                                                if(e.target.files[0].size<=46080)
                                                {
                                                    setImageFile(e.target.files[0])
                                                    setModalItem(
                                                        {
                                                            ...modalItem,
                                                            image:e.target.files[0]
                                                        }
                                                    )
                                                }    
                                                else    
                                                {
                                                    e.target.files=null
                                                    alert("File size more than 45kb")
                                                }
                                            }
                                        }} 
                                    />
                                </div>
                            </label>

                            <button 
                                className="p-1 w-full ring-4 ring-red-700 bg-red-600 hover:bg-red-500 rounded-2xl text-white font-semibold"
                                onClick={e=>{pushToDatabase(modalItem)}}
                            >
                                    Update
                            </button>
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
                // console.log(item,"keys : ", keys)
                var found=0;
                keys.forEach(key=>{
                    if(item[key].includes(search))
                    {
                        console.log("item[key] : ",item[key], item[key].includes(search))
                        found=1;
                    }
                })
                return found===1
            })

            console.log(items)
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
        console.log("iten : ",item)
        return (
            <div key={index} className="w-10/12 p-2 grid grid-cols-7">
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
                        onClick={()=>{
                            setModalItem(item)
                            setModalToggle(true)
                        }}
                    >View</div>
                </div>
            </div>
        )
    }

    useEffect(() => {
        RenderModal()
    }, [modalItem])

    return (
        <div className="h-full">
            {updateLoad&&(<div className="bg-white z-40 bg-opacity-95 fixed inset-0 flex justify-center items-center">
                    <div class="w-full h-full flex justify-center items-center space-x-5 mt-24">
                        <div
                            className="animate-spin rounded-full h-8 w-8 border-b-4 border-blue-500"
                        />
                    </div>
                </div>)}
            {modalToggle&&Modal}
            <div className="h-5/12 pt-12 pb-6 flex flex-col items-center bg-blue-200 filter drop-shadow-lg w-full">
                <div className="font-bold text-5xl w-full text-center text-gray-900">EDIT SPARE</div>

                <div className="flex flex-row space-x-3 w-full items-center justify-center mt-5">
                    <input 
                        value={search} 
                        onChange={e=>{setSearch(e.target.value)}} 
                        type="text" 
                        className="rounded-3xl h-10 w-5/12 p-3 pl-4 focus:outline-none" 
                        placeholder="Search by keyword"
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            <div className="mt-10 mb-10 flex flex-col h-full space-y-2 items-center justify center items-center">
                <div className="w-10/12 p-3 grid grid-cols-7 border-2 border-black divide-x-2 divide-black divide-solid rounded-xl">
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

export default AdminEdit
