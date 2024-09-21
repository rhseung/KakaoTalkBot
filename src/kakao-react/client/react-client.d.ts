import { AllConfig, AuthorizeConfig } from "../config";

export class ReactClient {
    constructor(authorizeConfig: AuthorizeConfig, config?: AllConfig);

    authorization: string;
    config: AllConfig;
    client: any;

    react(channelId: number | string | bigint, logId: number | string | bigint, type: number, linkId?: [number] | [string] | [bigint]): any;
    sync(channelId: number | string | bigint, start: number | string | bigint, end: number | string | bigint): any;
    member(channelId: number | string | bigint, logId: number | string | bigint): any;
    generateHeader(): { [key: string]: string };

    static create(authorizeConfig: AuthorizeConfig, config?: AllConfig): ReactClient;
}