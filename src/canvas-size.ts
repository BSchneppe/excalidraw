import {newImageElement} from "./element";
import { newElementWith } from "./element/mutateElement";
import { getNormalizedZoom } from "./scene";
import {AppProps, AppState, BinaryFiles, CanvasSize} from "./types";
import {ExcalidrawImageElement} from "./element/types";

export const BACKGROUND_ELEMENT_ID = "0000000000000000000000000000000000000000";
export const BACKGROUND_FILE_ID = BACKGROUND_ELEMENT_ID as ExcalidrawImageElement["fileId"];

export function adjustAppStateForCanvasSize(
  state: AppState,
  defaultCanvasSize?: AppProps["defaultCanvasSize"],
): AppState {
  if (state.canvasSize.mode === "infinite") {
    return state;
  }
  const { viewBackgroundColor } = state;
  const canvasSize: CanvasSize =
    state.canvasSize.mode !== "default"
      ? state.canvasSize
      : defaultCanvasSize
        ? { mode: "fixed", ...defaultCanvasSize }
        : { mode: "infinite" };

  if (canvasSize.mode !== "fixed") {
    return { ...state, canvasSize };
  }
  const { width: dstw, height: dsth } = state;
  let { width: srcw, height: srch, autoZoom } = canvasSize;
  const scale = Math.min(dstw / srcw, dsth / srch);
  [srcw, srch] = [srcw, srch].map((v) => v * scale);
  const scroll = autoZoom
    ? {
      scrollX: dstw > srcw ? (dstw - srcw) / 2 / scale : 0,
      scrollY: dsth > srch ? (dsth - srch) / 2 / scale : 0,
      zoom: {
        value: getNormalizedZoom(scale),
      },
    }
    : {};
  return {
    ...state,
    canvasSize,
    ...scroll,
    fixedCanvasFrameElement: state.fixedCanvasFrameElement
      ? newElementWith(state.fixedCanvasFrameElement, {
        width: canvasSize.width,
        height: canvasSize.height,
      })
      : newImageElement({
        id: BACKGROUND_ELEMENT_ID,
        type: "image",
        fileId: BACKGROUND_FILE_ID,
        x: 0,
        y: 0,
        strokeColor: "#00000005",
        fillStyle: "solid",
        strokeWidth: 1,
        strokeStyle: "solid",
        roughness: 0,
        opacity: 100,
        locked: true,
        width: canvasSize.width,
        height: canvasSize.height,
      }),
  };
}
