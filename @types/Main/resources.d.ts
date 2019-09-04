declare namespace Resources {
    interface File {
        name: string;
        data: Promise<string | void>;
    }

    interface Page {
        url: string;
        data: string;
        links: string[];
    }
}