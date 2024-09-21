/**
 * Represents the configuration for KakaoTalk.
 */
export type AllConfig = {
    kakaotalkVersion?: string;
    okhttpVersion?: string;
};

export declare const KakaoTalkConfig: Required<AllConfig>;

/**
 * Represents the authorization configuration.
 */
export type AuthorizeConfig = {
    accessToken: string;
    deviceUUID: string;
};