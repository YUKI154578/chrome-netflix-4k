(() => {
  "use strict";

  Object.defineProperties(window.screen, {
    width: { configurable: true, get: () => 3840 },
    height: { configurable: true, get: () => 2160 },
    availWidth: { configurable: true, get: () => 3840 },
    availHeight: { configurable: true, get: () => 2160 }
  });

  Object.defineProperties(window, {
    devicePixelRatio: { configurable: true, get: () => 1.5 },
    outerWidth: { configurable: true, get: () => 3840 },
    outerHeight: { configurable: true, get: () => 2160 }
  });

  // Change only supported minimum queries; leave other media features native.
  const nativeMatchMedia = window.matchMedia;
  if (nativeMatchMedia) {
    window.matchMedia = function (query) {
      if (typeof query !== "string") return nativeMatchMedia.apply(this, arguments);
      const adjusted = query.replace(/\(\s*min-(width|height|resolution)\s*:\s*([\d.]+)\s*(px|dppx|dpi|dpcm)\s*\)/gi,
        (match, feature, number, unit) => {
          const value = Number(number);
          feature = feature.toLowerCase();
          unit = unit.toLowerCase();
          if (feature === "width" && unit === "px" && value <= 3840 ||
              feature === "height" && unit === "px" && value <= 2160 ||
              feature === "resolution" && ((unit === "dppx" && value <= 1.5) ||
                (unit === "dpi" && value <= 144) || (unit === "dpcm" && value <= 144 / 2.54))) {
            return `(min-${feature}: 0${unit})`;
          }
          return match;
        });
      return nativeMatchMedia.call(this, adjusted);
    };
  }

  const isHevc = type => typeof type === "string" && /\b(?:hev1|hvc1)\b/i.test(type);
  if (window.MediaSource?.isTypeSupported) {
    const original = MediaSource.isTypeSupported;
    MediaSource.isTypeSupported = function (type) {
      return isHevc(type) ? true : original.apply(this, arguments);
    };
  }

  const capabilities = navigator.mediaCapabilities;
  if (capabilities?.decodingInfo) {
    const original = capabilities.decodingInfo;
    capabilities.decodingInfo = async function (configuration) {
      const result = await original.apply(this, arguments);
      if (!isHevc(configuration?.video?.contentType)) return result;
      return { ...result, supported: true, smooth: true, powerEfficient: true };
    };
  }
})();
