import { customerApi } from "_apis_/customer.api";

export const uploadImage = async (files: any[]) => {
  const file = files[0];
  if (file) {
    const post = await customerApi.uploadFile({ file });
    if (post.data) {
      return { url: post.data.image, id: post.data.id };
    }
    return null;
  }
  return null;
};

export const readerMultiFile = (files: any[], setUrls: (urls: string[]) => void) => {
  let readers = [];
  // Abort if there were no files selected
  if (!files.length) return;

  // Store promises in array
  for (let i = 0; i < files.length; i++) {
    readers.push(readFileAsText(files[i]));
  }
  // Trigger Promises
  Promise.all(readers).then((values: any) => {
    // Values will be an array that contains an item
    // with the text of every selected file
    // ["File1 Content", "File2 Content" ... "FileN Content"]
    setUrls(values);
  });
};

/**
 *  Simple JavaScript Promise that reads a file as text.
 **/
function readFileAsText(file: any) {
  return new Promise(function (resolve, reject) {
    let fr = new FileReader();
    fr.readAsDataURL(file);

    fr.onload = function () {
      resolve(fr.result);
    };

    fr.onerror = function () {
      reject(fr);
    };

    // fr.readAsText(file);
  });
}
