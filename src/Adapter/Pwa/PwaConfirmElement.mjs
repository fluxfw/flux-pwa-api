import { PWA_LOCALIZATION_MODULE } from "../Localization/_LOCALIZATION_MODULE.mjs";

/** @typedef {import("./confirm.mjs").confirm} _confirm */
/** @typedef {import("../../../../flux-css-api/src/Adapter/Api/CssApi.mjs").CssApi} CssApi */
/** @typedef {import("../../../../flux-localization-api/src/Adapter/Api/LocalizationApi.mjs").LocalizationApi} LocalizationApi */

const __dirname = import.meta.url.substring(0, import.meta.url.lastIndexOf("/"));

export class PwaConfirmElement extends HTMLElement {
    /**
     * @type {string}
     */
    #cancel_text;
    /**
     * @type {_confirm}
     */
    #confirm;
    /**
     * @type {string}
     */
    #confirm_text;
    /**
     * @type {CssApi}
     */
    #css_api;
    /**
     * @type {string}
     */
    #info_text;
    /**
     * @type {LocalizationApi}
     */
    #localization_api;
    /**
     * @type {string}
     */
    #name;
    /**
     * @type {ShadowRoot}
     */
    #shadow;

    /**
     * @param {CssApi} css_api
     * @param {LocalizationApi} localization_api
     * @param {string} name
     * @param {string} info_text
     * @param {string} confirm_text
     * @param {string} cancel_text
     * @param {_confirm} confirm
     * @returns {PwaConfirmElement}
     */
    static new(css_api, localization_api, name, info_text, confirm_text, cancel_text, confirm) {
        return new this(
            css_api,
            localization_api,
            name,
            info_text,
            confirm_text,
            cancel_text,
            confirm
        );
    }

    /**
     * @param {CssApi} css_api
     * @param {LocalizationApi} localization_api
     * @param {string} name
     * @param {string} info_text
     * @param {string} confirm_text
     * @param {string} cancel_text
     * @param {_confirm} confirm
     * @private
     */
    constructor(css_api, localization_api, name, info_text, confirm_text, cancel_text, confirm) {
        super();

        this.#css_api = css_api;
        this.#localization_api = localization_api;
        this.#name = name;
        this.#info_text = info_text;
        this.#confirm_text = confirm_text;
        this.#cancel_text = cancel_text;
        this.#confirm = confirm;

        this.#shadow = this.attachShadow({ mode: "closed" });
        this.#css_api.importCssToRoot(
            this.#shadow,
            `${__dirname}/${this.constructor.name}.css`
        );

        this.#render();
    }

    /**
     * @param {boolean} confirm
     * @returns {void}
     */
    #click(confirm) {
        for (const button_element of this.#shadow.querySelectorAll("button")) {
            if (button_element.disabled) {
                return;
            }

            button_element.disabled = true;
        }

        this.#confirm(
            confirm
        );
    }

    /**
     * @returns {Promise<void>}
     */
    async #render() {
        const container_element = document.createElement("div");
        container_element.classList.add("container");

        const info_element = document.createElement("div");
        info_element.classList.add("info");
        info_element.innerText = await this.#localization_api.translate(
            this.#info_text,
            PWA_LOCALIZATION_MODULE,
            {
                name: this.#name
            }
        );
        container_element.appendChild(info_element);

        const buttons_element = document.createElement("div");
        buttons_element.classList.add("buttons");

        const confirm_button_element = document.createElement("button");
        confirm_button_element.innerText = await this.#localization_api.translate(
            this.#confirm_text,
            PWA_LOCALIZATION_MODULE
        );
        confirm_button_element.type = "button";
        confirm_button_element.addEventListener("click", () => {
            this.#click(
                true
            );
        });
        buttons_element.appendChild(confirm_button_element);

        const cancel_button_element = document.createElement("button");
        cancel_button_element.innerText = await this.#localization_api.translate(
            this.#cancel_text,
            PWA_LOCALIZATION_MODULE
        );
        cancel_button_element.type = "button";
        cancel_button_element.addEventListener("click", () => {
            this.#click(
                false
            );
        });
        buttons_element.appendChild(cancel_button_element);

        container_element.appendChild(buttons_element);

        this.#shadow.appendChild(container_element);
    }
}

export const PWA_CONFIRM_ELEMENT_TAG_NAME = "flux-pwa-confirm";

customElements.define(PWA_CONFIRM_ELEMENT_TAG_NAME, PwaConfirmElement);
