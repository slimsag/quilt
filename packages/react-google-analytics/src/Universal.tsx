import * as React from 'react';
import ImportRemote from '@shopify/react-import-remote';

import {UniversalAnalytics} from './types';
import {getRootDomain, noop} from './utilities';

export interface Props {
  account: string;
  domain: string;
  set?: {[key: string]: any};
  onLoad?(analytics: UniversalAnalytics): void;
  debug?: boolean;
}

export const SETUP_SCRIPT = `
  window['GoogleAnalyticsObject'] = 'ga';
  window['ga'] = window['ga'] || function() {
    (window['ga'].q = window['ga'].q || []).push(arguments);
  };
  window['ga'].l = 1 * new Date();
`;

export const UNIVERSAL_GA_SCRIPT =
  'https://www.google-analytics.com/analytics.js';

export const UNIVERSAL_GA_DEBUG_SCRIPT =
  'https://www.google-analytics.com/analytics_debug.js';

export default class UniversalGoogleAnalytics extends React.PureComponent<
  Props,
  never
> {
  render() {
    const {debug} = this.props;

    return (
      <>
        <script
          id="google-analytics-universal-script"
          dangerouslySetInnerHTML={{__html: SETUP_SCRIPT}}
        />
        <ImportRemote
          preconnect
          source={debug ? UNIVERSAL_GA_DEBUG_SCRIPT : UNIVERSAL_GA_SCRIPT}
          getImport={getUniversalAnalytics}
          onError={noop}
          onImported={this.setAnalytics}
        />
      </>
    );
  }

  private setAnalytics = (googleAnalytics: UniversalAnalytics) => {
    const {
      account,
      domain,
      set: setVariables = {},
      onLoad,
      debug = false,
    } = this.props;

    const normalizedDomain = getRootDomain(domain);
    const options = {
      cookieDomain: normalizedDomain,
      legacyCookieDomain: normalizedDomain,
      allowLinker: true,
    };

    if (debug) {
      // The debug version of the analytics.js library
      // https://developers.google.com/analytics/devguides/collection/analyticsjs/debugging
      googleAnalytics('set', 'sendHitTask', null);
    }

    googleAnalytics('create', account, 'auto', options);

    for (const [key, value] of Object.entries(setVariables)) {
      googleAnalytics('set', key, value);
    }

    if (onLoad) {
      onLoad(googleAnalytics);
    }
  };
}

interface WindowWithUniversalAnalytics extends Window {
  ga: UniversalAnalytics;
}

function getUniversalAnalytics(window: Window) {
  return (window as WindowWithUniversalAnalytics).ga;
}
