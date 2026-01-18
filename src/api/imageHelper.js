// imageHelper.js

// ⚠️ In values ko apne Cloudinary dashboard/preset se replace karna
const CLOUD_NAME = "dkuydc7af";           
const UPLOAD_PRESET = "bharat_khazana_unsigned";   

export const uploadImage = async (file) => {
  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);   // unsigned preset

  const res = await fetch(url, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("Cloudinary upload error:", err);
    throw new Error("Image upload failed");
  }

  const data = await res.json();
  // data.secure_url = public image URL
  return data.secure_url;
};




