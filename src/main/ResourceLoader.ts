import { Request } from 'Utils/Main';

export default class ResourceLoader {
    private resourcesMap: string[];

    constructor() {
        this.resourcesMap = [];
    }

    get resources() {
        return this.resourcesMap;
    }

    public async loadFromUrl(url: string, regexp?: RegExp): Promise<Resources.Page> {
        const reg = regexp ? regexp : /['"]https?:\/\/([^'"]+)['"]/gi
        const responce: Resources.Page = {
            url,
            data: '',
            links: []
        };

        try {
            const res = await Request(url);

            this.resourcesMap = res.data.match(reg).map(s => s.trim().replace(/['"]/g, ''));

            responce.data = res.data;
            responce.links = this.resourcesMap;
        } catch (error) {
            throw new Error(error);
        }

        return responce;
    }

    public loadFigmaRes(url: string): Promise<Resources.Page> {
        const regex = /['"]((https?:\/\/)|(\/figbuild))([^'"]+)\.(js|css|ico|jpe?g|png|map)([A-Za-z0-9=\?._-]+)?['"]/gi;

        return this.loadFromUrl(url, regex);
    }
}
