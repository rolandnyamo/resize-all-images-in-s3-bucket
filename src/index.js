const sharp = require("sharp");

const bucket = "mimbbo-assets";

const { listS3Objects, getFromS3, s3Put, heicConvert } = require("./utils");

async function listS3() {
  let ob = await listS3Objects({ bucket }),
    keys = [];

  ob.Contents.forEach((k) => {
    if (k.Key.match(".+/.+")) {
      keys.push(k.Key);
    }
  });

  for (let i = 0; i < keys.length; i++) {
    const element = keys[i];

    let s3Image = await getFromS3({ bucket, key: element });

    let image = await sharp(s3Image.Body);

    let metadata = await image.metadata();

    let type = metadata.format

    if(type.toLowerCase() === 'heif'){
        
        console.log(element)

        type = 'jpeg'

        let jpegImg = await heicConvert({
          image: s3Image.Body,
          format: 'JPEG'
        })

        image = await sharp(jpegImg) //load new image in sharp again

        metadata = await image.metadata()

        console.log(metadata.format)
      }

    if (metadata.width > 1080) {
      console.log("resizing 1080+ image!");

      const resizedImage = await image
        .resize({ width: 900 })
        .withMetadata()
        .toBuffer();
      console.log("successfully resized!");
      await s3Put({ bucket, key: element, body: resizedImage, type });
    } else if (metadata.width < 320) {
      console.log("resizing 320- image!");

      const resizedImage = await image
        .resize({ width: 320 })
        .withMetadata()
        .toBuffer();
      await s3Put({ bucket, key: element, body: resizedImage, type });

      console.log("successfully resized!");

    //   await s3Put({
    //     bucket,
    //     key: keys[i],
    //     type: metadata.format,
    //     body: resizedImage,
    //   });
    }
  }

  console.log(keys);
}

listS3();
