import type { IntrospectionQuery } from 'graphql';
import {
  EMBEDDABLE_SANDBOX_URL,
  IFRAME_DOM_ID,
  SCHEMA_RESPONSE,
} from '../helpers/constants';
import { defaultHandleRequest } from '../helpers/defaultHandleRequest';
import {
  HandleRequest,
  sendPostMessageToEmbed,
} from '../helpers/postMessageRelayHelpers';
import { setupSandboxEmbedRelay } from './setupSandboxEmbedRelay';
import packageJSON from '../../package.json';

export interface EmbeddableSandboxOptions {
  target: string | HTMLElement; // HTMLElement is to accomodate people who might prefer to pass in a ref
  initialEndpoint?: string;

  initialState?: {
    document?: string;
    variables?: Record<string, any>;
    headers?: Record<string, string>;
  };
  persistExplorerState?: boolean; // defaults to 'false'

  // optional. defaults to `return fetch(url, fetchOptions)`
  handleRequest?: HandleRequest;
  // defaults to false. If you pass `handleRequest` that will override this.
  includeCookies?: boolean;
}

let idCounter = 0;

export class EmbeddedSandbox {
  options: EmbeddableSandboxOptions;
  handleRequest: HandleRequest;
  embeddedSandboxIFrameElement: HTMLIFrameElement;
  uniqueEmbedInstanceId: number;
  private disposable: { dispose: () => void };
  constructor(options: EmbeddableSandboxOptions) {
    this.options = options;
    this.validateOptions();
    this.handleRequest =
      this.options.handleRequest ??
      defaultHandleRequest({ includeCookies: !!this.options.includeCookies });
    this.uniqueEmbedInstanceId = idCounter++;
    this.embeddedSandboxIFrameElement = this.injectEmbed();
    this.disposable = setupSandboxEmbedRelay({
      embeddedSandboxIFrameElement: this.embeddedSandboxIFrameElement,
      handleRequest: this.handleRequest,
    });
  }

  dispose() {
    // remove the dom element
    document
      .getElementById(IFRAME_DOM_ID(this.uniqueEmbedInstanceId))
      ?.remove();
    // remove the listener
    this.disposable.dispose();
  }

  injectEmbed() {
    let element: HTMLElement | null;
    const { target, persistExplorerState } = this.options;

    const {
      document: initialDocument,
      variables,
      headers,
    } = this.options.initialState || {};

    const queryParams = {
      endpoint: this.options.initialEndpoint,
      defaultDocument: initialDocument
        ? encodeURIComponent(initialDocument)
        : undefined,
      defaultVariables: variables
        ? encodeURIComponent(JSON.stringify(variables, null, 2))
        : undefined,
      defaultHeaders: headers
        ? encodeURIComponent(JSON.stringify(headers))
        : undefined,
      shouldPersistState: !!persistExplorerState,
      version: packageJSON.version,
    };

    const queryString = Object.entries(queryParams)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');

    if (typeof target === 'string') {
      element = document?.querySelector?.(target);
    } else {
      element = target;
    }
    const iframeElement = document.createElement('iframe');
    iframeElement.src = `${EMBEDDABLE_SANDBOX_URL}?${queryString}`;

    iframeElement.id = IFRAME_DOM_ID(this.uniqueEmbedInstanceId);
    iframeElement.setAttribute(
      'style',
      'height: 100%; width: 100%; border: none;'
    );

    element?.appendChild(iframeElement);

    return iframeElement;
  }

  validateOptions() {
    if (!this.options.target) {
      throw new Error('"target" is required');
    }
  }

  updateSchemaInEmbed({
    schema,
  }: {
    schema?: string | IntrospectionQuery | undefined;
  }) {
    sendPostMessageToEmbed({
      message: {
        name: SCHEMA_RESPONSE,
        schema,
      },
      embeddedIFrameElement: this.embeddedSandboxIFrameElement,
      embedUrl: EMBEDDABLE_SANDBOX_URL,
    });
  }
}
