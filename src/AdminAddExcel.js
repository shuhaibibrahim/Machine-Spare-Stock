import React,{useContext, useState} from 'react'
import { saveAs } from "file-saver";
import excelfile from "./components/sample-template.xlsx"
// importrom '@mui/icons-material/Download';
// import TelegramIcon from '@mui/icons-material/Telegram';
import AdminAdd from './AdminAdd';
import Uploader from './components/Uploader';
import { push, ref, set } from 'firebase/database';
import { db } from './firebase_config';

function AdminAddExcel() {
    const saveFile = () => {
        saveAs(
        // "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        // "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        excelfile,
        "SpareData_Template.xlsx"
        );
    };

    const [uploaded,setUploaded]=useState(false);
    const [jsonData,setJsonData]=useState([]);
    const [indEmail,setIndEmail]=useState("");
    const [indAdmno,setIndAdmno]=useState("");
    const [indName,setIndName]=useState("")
    const [updateLoad, setUpdateLoad] = useState(false)

    var updateCount=0
    const pushToDatabase = (item) => {
        setUpdateLoad(true)

        const spareRef = ref(db, `spares/`);
        const newSpareRef = push(spareRef);

        set(newSpareRef, {
            ...item,
            image:"", 
            id:newSpareRef.key
        })
        .then((ref)=>{

            if(updateCount===jsonData.length-1)
            {
                setUpdateLoad(false)
                updateCount=0
            }
            else
                updateCount++
        })
        .catch(error=>{
            alert("Couldnt save data!");
            return;
        })
    }

  const uploadData=()=>{
    if(jsonData.length===0)
    {
        alert("Please select an excel file with valid data")
    }
    else
    {
        setUpdateLoad(true)
        updateCount=0
        for(var index in jsonData)
        {
            if(jsonData[index].sap.toLowerCase()==="yes")
                jsonData[index].sap="Yes"
            if(jsonData[index].sap.toLowerCase()==="no")
                jsonData[index].sap="No"
            
            pushToDatabase(jsonData[index])
            // console.log(jsonData[index])
        }
    }
  }

  return (
    <div className='flex flex-col w-full justify-center items-center'>
        {updateLoad&&(<div className="bg-white z-40 bg-opacity-95 fixed inset-0 flex justify-center items-center">
            <div class="w-full h-full flex justify-center items-center space-x-5 mt-24">
                <div
                    className="animate-spin rounded-full h-8 w-8 border-b-4 border-blue-500"
                />
            </div>
        </div>)}

         <div className="p-12 flex flex-row items-center bg-blue-200 filter drop-shadow-lg w-full">
            <div className="font-bold text-5xl w-full text-center text-gray-900">SPARE ADD</div>
        </div>
        
        <div className='w-10/12 p-5 flex flex-col space-y-3'>
            <div className='w-full flex flex-row items-center justify-end mt-5 space-x-2'>
                <button className='py-2 bg-green-800 cursor-pointer hover:bg-green-600 px-3 text-white text-sm font-semibold rounded-2xl ' onClick={saveFile}> Download Template</button>

                <button 
                    className=' p-3 py-2 cursor-pointer hover:bg-green-600 px-3 bg-green-800 text-white text-sm font-semibold rounded-2xl'
                    onClick={()=>{
                        uploadData()
                    }}
                >
                    Upload spare data
                </button>
            </div>
            
            <Uploader uploaded={uploaded} setUploaded={setUploaded} jsonData={jsonData} setJsonData={setJsonData}/>
            
            {/* <div className="w-full flex items-end justify-end ">
                <button className='mb-3 p-3 py-2 cursor-pointer hover:bg-green-600 px-3 bg-green-800 text-white text-sm font-semibold rounded-2xl'> Add spare</button>
            </div> */}
        </div>

        <AdminAdd/>
    </div>
  )
}

export default AdminAddExcel