"use client"

import { createPrediction, getPrediction } from "@/actions";
import { useFormState, useFormStatus } from "react-dom";
import { Prediction } from "../../types";

 const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

 

const FormContent=()=>{

  const{pending}=useFormStatus()

  return(
    <>
      {pending?<div className="skeleton w-[512px] h-[480px]"></div>: null}

      <input
        type="file"
        accept="image/*"
        required
        className="input input-bordered w-full "
        name="image"
        defaultValue="https://replicate.delivery/pbxt/IJZOELWrncBcjdE1s5Ko8ou35ZOxjNxDqMf0BhoRUAtv76u4/room.png"
        placeholder="https://replicate.delivery/pbxt/IJZOELWrncBcjdE1s5Ko8ou35ZOxjNxDqMf0BhoRUAtv76u4/room.png"
      />

      <textarea
        placeholder="A bedroom"
        className="textarea textarea-bordered"
        name="prompt"
      ></textarea>

      <button disabled={pending} className="btn btn-success">{pending ? <span className="loading loading-infinity loading-lg"></span>:"Crear"}</button>
    </>
  )
}
export default function HomePage() {
  
  const [state,formAction]=useFormState(handleSubmit, null)

  async function handleSubmit(_state:null | Prediction,formData:FormData){

    let prediction = await createPrediction(formData)

    while(["starting","processing"].includes(prediction.status)){
       prediction = await getPrediction(prediction.id)
     

      await sleep(4000)
    }

    return prediction
  }

  return (
    <section className="m-auto my-12 grid max-w-[512px] gap-4 ">

      <h1 className="mx-auto text-3xl">Decoración de interiores</h1>

      {state?.output &&(
        <img alt="Previsualizacion del render" src={state.output[1]}/>
      )}
    <form
      action={formAction}
      className=" grid  gap-4 "
    >
    <FormContent/>
    </form>
    </section>
  );
}
