const sharp = require("sharp")

const bucket = '<bucket_name>'

const { listS3Objects, getFromS3, s3Put } = require('./utils')

async function listS3() {

    let ob = await listS3Objects({ bucket }),
        keys = []

    ob.Contents.forEach(k => {

        if (k.Key.match('.+\/.+')) {
            keys.push(k.Key)
        }
    });

    for (let i = 0; i < keys.length; i++) {
        const element = keys[i];

        let image = await getFromS3({ bucket, key: keys[i] })

        image = await sharp(image.Body)

        const metadata = await image.metadata()

        const resizedImage = await image.resize({ width: 900 }).withMetadata().toBuffer()

        await s3Put({
            bucket, 
            key: keys[i], 
            type: metadata.format, 
            body: resizedImage
        })
    }

    console.log(keys)
}

listS3()