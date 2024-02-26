"use server"
import { unstable_noStore as noStore } from "next/cache";
import { Prediction } from "../types";



export const createPrediction = async ( formData: FormData): Promise<Prediction> => {
    
    noStore()
    
    const imageUrl = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLAUDINARY_CLOUD_NAME}/image/upload?upload_preset=replicate-app&folder=replicate-app`,
      {
        method: "PUT",
        body: formData.get("image") as File,
      },
    )
      .then((res) => res.json() as Promise<{secure_url : string}>)
      .then(({secure_url}) => secure_url)



    const prediction = await fetch("https://replicate.com/api/predictions", {
      headers: {
        accept: "application/json",
        "accept-language": "es-ES,es;q=0.9,en;q=0.8",
        "content-type": "application/json",
        "sec-ch-ua":
          '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-csrftoken": "3ZZ9ztrqJWVK3D7BWoy33ZIGuHGJDgll",
      },
      referrer: "https://replicate.com/jagilley/controlnet-hough",
      referrerPolicy: "same-origin",
      body: JSON.stringify({
        input: {
          eta: 0,
          image: imageUrl,
          scale: 9,
          prompt: formData.get("prompt") as string,
          a_prompt: "best quality, extremely detailed,4k,octane render",
          n_prompt:
            "longbody, lowres, bad anatomy, bad hands, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality",
          ddim_steps: 20,
          num_samples: "1",
          value_threshold: 0.1,
          image_resolution: "512",
          detect_resolution: 512,
          distance_threshold: 0.1,
        },
        is_training: false,
        create_model: "0",
        stream: false,
        version:
          "854e8727697a057c525cdb45ab037f64ecca770a1769cc52287c2e56472a247b",
      }),
      method: "POST",
      mode: "cors",
      credentials: "include",
    }).then((res) => res.json() as Promise<Prediction>);

   

    return prediction
  };

  export const getPrediction=async(id:string)=>{
    noStore()
    
    return fetch("https://replicate.com/api/predictions/" + id, {
        "headers": {
          "accept": "*/*",
          "accept-language": "es-ES,es;q=0.9,en;q=0.8",
          "baggage": "sentry-public_key=3dc017e574684610bbc7fd3b5519a4e8,sentry-trace_id=02f28aa0701a46f2800bded1837d3e9f,sentry-sample_rate=0.1",
          "sec-ch-ua": "\"Not A(Brand\";v=\"99\", \"Google Chrome\";v=\"121\", \"Chromium\";v=\"121\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"Windows\"",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "sentry-trace": "02f28aa0701a46f2800bded1837d3e9f-99b38173cdf4a94d-0"
        },
        "referrer": "https://replicate.com/jagilley/controlnet-hough?prediction=tcui7ktbpj7f6spidbpifk4vlm",
        "referrerPolicy": "same-origin",
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
      }).then((res) => res.json() as Promise<Prediction>);
  }