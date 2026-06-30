"use client"

import React from 'react'
import Link from 'next/link'
import { IoMdArrowDropdown } from "react-icons/io";
import { useState } from 'react';
import clsx from 'clsx';
import { RiShareBoxLine } from "react-icons/ri";
import { MdDescription } from "react-icons/md";

function Nav2() {
const [state, setState] = useState<any>([
    {
        id: '1',
        title: 'Editorial',
        value1: 'Editorial Board',
        value2: 'Editorial Procedure',
    },
    {
        id: '2',
        title: 'Reviewer',
        value1: 'Reviewer Instructions',
        value2: 'Join as Reviewer',
    },
    {
        id: '3',
        title: 'Author',
        value1: 'Author Instructions',
        value2: 'Puublication Charges',
    },
    {
        id: '4',
        title: 'Articles',
        value1: 'Current Issue',
        value2: 'Archive',
        value3: 'Ahead of Print',
    },
    {
        id: '5',
        title: 'Journal Info',
        value1: 'Subscribe',
        value2: 'Call for Papers',
        
    },


])


const [stateHide, setShowHide] = useState<any>()

const funcToggle = (id:any) =>{
    setShowHide((currentId:any)  => currentId === id ? null: id)
}



  return (
    <div className='bg-[#2c2c2c] h-16 flex justify-around items-center' >
        <div className='flex gap-4 text-white' >
            <Link className='p-2' href={'/'} >Home</Link>
        
            <Link className='p-2' href={'/'} >About Journal</Link>
       
            <Link className='p-2' href={'/'} >Publication Ethics</Link>


                
            {
                state.map((v:any,i:number) => {
                    return(
                <div>
               
                            <div className='flex items-center hover:bg-[#444444] justify-center cursor-pointer' onClick={() => funcToggle(v.id)}>
                                <p className='p-2' >{v.title}</p>
                                <IoMdArrowDropdown />
                            </div>


                <div key={v.id} className={clsx('bg-[#f8f9fa] py-2 h-auto gap-1 absolute z-50 text-sm w-auto text-gray-500 rounded-xl text-start flex-col justify-center border mt-10 border-gray-300 shadow font-bold', stateHide === v.id ? 'flex' : 'hidden')} >
                        <p className='hover:bg-blue-500 hover:text-white p-1' >{`${v.value1}`}</p>
                    <p className='hover:bg-blue-500 hover:text-white p-1' >{v.value2} </p>
                    <p className='hover:bg-blue-500 hover:text-white p-1' >{v.value3} </p>
                </div> 
                </div>
                    )
                })
            }
            <Link className='p-2' href={'/'} >Contact Us</Link>
                
        </div>
        <Link className='p-2 flex gap-2 text-white items-center justify-center' href={'/'} >Submit Manuscript <RiShareBoxLine /></Link>
    </div>
  )
}

export default Nav2