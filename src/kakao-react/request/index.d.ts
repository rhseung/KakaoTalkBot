export class RequestClient {
    constructor(host: string);
    
    changeHost(host: string): void;
    request(
        method: string,
        path: string,
        data: Record<string, unknown> | string,
        headers: Record<string, string>,
        followRedirect?: boolean
    ): {
        body(): string;
        statusCode(): number;
        cookies(): { putAll(obj: unknown): void };
        url(): { toExternalForm(): string };
        parse(): {
            select(query: string): { attr(str: string): string };
            getElementById(id: string): { data(): string };
        };
    };
}