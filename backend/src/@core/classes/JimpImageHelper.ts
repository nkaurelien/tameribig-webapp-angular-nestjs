import Jimp from 'jimp';
import {join} from 'path';

// import Jimp = require('jimp');

export class JimpImageHelper {
    private logoImage: Jimp;
    private originelMaskImage: Jimp;
    private originalImage: Jimp;
    private originalImageEntry: any;

    constructor(originalImageEntry: string | Buffer | Jimp) {
        this.originalImageEntry = originalImageEntry;
    }

    public static extractExtension(originalname: string) {
        let ext = '';
        const chunk = originalname.split('.');
        if (chunk.length) {
            ext = chunk[chunk.length - 1] || '';
        }
        return ext;
    }

    /**
     *
     * @param imageEntry: string | Buffer | Jimp
     */
    async loadImage(imageEntry?: string | Buffer | Jimp): Promise<void> {

        if (!!imageEntry) {
            if (typeof imageEntry === 'string') {
                this.originalImage = await Jimp.read(imageEntry);
            } else if (Buffer.isBuffer(imageEntry)) {
                this.originalImage = await Jimp.read(imageEntry);
            } else if (typeof imageEntry === 'object') {
                this.originalImage = await Jimp.read(imageEntry);
            }
        } else {
            if (this.originalImage === undefined) {
                this.originalImage = await Jimp.read(this.originalImageEntry);
            }
        }
    }

    setOriginalImage(image: Jimp): void {
        if (image !== undefined) {
            this.originalImage = image;
        }
    }

    async applyMask1(): Promise<Jimp> {
        const maskPath = join(
            process.cwd(),
            'src',
            'resources',
            'images',
            'mask',
            'mask1.jpeg',
        );
        return this.applyCustomMask(maskPath, {
            opacity: 0.3,
            height: 512,
            width: 512,
        });
    }

    async applyMask2(): Promise<Jimp> {
        const maskPath = join(
            process.cwd(),
            'src',
            'resources',
            'images',
            'mask',
            'mask2.jpeg',
        );
        return this.applyCustomMask(maskPath, {
            opacity: 0.9,
            height: 512,
            width: 512,
        });
    }

    async applyMask3(): Promise<Jimp> {
        const maskPath = join(
            process.cwd(),
            'src',
            'resources',
            'images',
            'mask',
            'mask3.jpeg',
        );
        return this.applyCustomMask(maskPath, {
            opacity: 0.9,
            height: 512,
            width: 512,
        });
    }

    async applyMask4(): Promise<Jimp> {
        const maskPath = join(
            process.cwd(),
            'src',
            'resources',
            'images',
            'mask',
            'mask4.jpeg',
        );
        return this.applyCustomMask(maskPath, {
            opacity: 0.3,
            height: 512,
            width: 512,
        });
    }

    async applyCustomMask(
        maskImagePath: string,
        resizeOption?: { height: number; width: number; opacity: number },
    ): Promise<Jimp> {
        await this.loadImage();
        this.originelMaskImage = await Jimp.read(maskImagePath);

        if (resizeOption === undefined) {
            resizeOption = {
                height: 512,
                width: 512,
                opacity: 0.25,
            };
        }

        let image = this.originalImage.clone(err => {
            if (err) {
                throw err;
            }
        });

        const maskImage = this.originelMaskImage.clone(err => {
            if (err) {
                throw err;
            }
        });

        image.resize(resizeOption.width, resizeOption.height, Jimp.RESIZE_BEZIER);

        maskImage.resize(
            resizeOption.width,
            resizeOption.height,
            Jimp.RESIZE_BEZIER,
        );

        const xPlace = image.getWidth() / 2 - maskImage.getWidth() / 2;

        const yPlace = image.getHeight() / 2 - maskImage.getWidth() / 2;

        maskImage.opacity(resizeOption.opacity);

        image.composite(maskImage, xPlace, yPlace, {
            mode: Jimp.BLEND_DESTINATION_OVER,
            opacitySource: 0.2,
            opacityDest: 0.2,
        });

        // image = await this.printLogo(image);
        //
        // image = await this.printText(image, '© TAMERIBIG');

        return image;
    }

    async printLogo(image: Jimp): Promise<Jimp> {
        const logoPath = join(
            process.cwd(),
            'src',
            'resources',
            'images',
            'mask',
            'logo.jpg',
        );
        this.logoImage = await Jimp.read(logoPath);

        const xPlace = image.getWidth() / 2 - this.logoImage.getWidth() / 2;

        const yPlace = image.getHeight() / 2;

        this.logoImage.opacity(0.2);

        image.composite(this.logoImage, xPlace, yPlace, {
            mode: Jimp.BLEND_DESTINATION_OVER,
            opacitySource: 0.2,
            opacityDest: 0.2,
        });

        return image;
    }

    async printText(image: Jimp, text: string): Promise<Jimp> {
        const textData = {
            text, // the text to be rendered on the image
            maxWidth: image.getWidth() - 10 - 10, // image width - 10px margin left - 10px margin right
            maxHeight: this.logoImage.getHeight() + 20, // logo height + margin
            placementX: 10, // 10px in on the x axis
            placementY: image.getHeight() - (this.logoImage.getHeight() + 20) - 10, // bottom of the image: height - maxHeight - margin
        };

        // load font
        const font = await Jimp.loadFont(Jimp.FONT_SANS_16_WHITE);

        image.print(
            font,
            textData.placementX,
            textData.placementY,
            {
                text: textData.text,
                alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
                alignmentY: Jimp.VERTICAL_ALIGN_BOTTOM,
            },
            textData.maxWidth,
            textData.maxHeight,
        );

        return image;
    }
}
