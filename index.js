"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const openid_client_1 = require("openid-client");
class NodeKeycloak {
    /**
     * 配置Keycloak相关信息
     * @param issuer eg: https://identity.keycloak.org/realms/master/
     * @param response_types default: ['code']
     * @returns
     */
    static async configure(parameters) {
        const keycloakIssuer = await openid_client_1.Issuer.discover(parameters.issuer);
        NodeKeycloak.client = new keycloakIssuer.Client({
            client_id: parameters.client_id,
            client_secret: parameters.client_secret,
            redirect_uris: parameters.redirect_uris,
            response_types: parameters.response_types || ['code'],
        });
    }
    /**
     * 获取Keycloak登录界面URL
     * @returns 返回Keycloak登录界面URL
     */
    static async authorizationUrl(parameters) {
        return await NodeKeycloak.client.authorizationUrl(Object.assign({}, parameters));
    }
    /**
     * 登录
     * @param code
     * @param session_state
     * @returns 返回 Token / 用户信息
     */
    static async callback(parameters) {
        const { login_redirect_uri, code } = parameters;
        return await NodeKeycloak.client.callback(login_redirect_uri, {
            code: parameters.code,
            session_state: parameters.session_state,
        });
    }
    /**
     * 登出
     * @param post_logout_redirect_uri 退出后重定向URL
     * @returns
     */
    static async signout(id_token_hint, post_logout_redirect_uri) {
        return await NodeKeycloak.client.endSessionUrl({
            id_token_hint: id_token_hint,
            post_logout_redirect_uri: post_logout_redirect_uri,
        });
    }
    static async refresh(refreshToken, extras) {
        return NodeKeycloak.client.refresh(refreshToken, extras);
    }
    static async userinfo(accessToken, options) {
        return await this.client.userinfo(accessToken, options);
    }
}
exports.default = NodeKeycloak;
//# sourceMappingURL=index.js.map