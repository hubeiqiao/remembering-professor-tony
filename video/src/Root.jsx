import {Composition} from 'remotion';

import {WebsiteWalkthrough} from './compositions/WebsiteWalkthrough.jsx';
import {
  DEFAULT_PROPS,
  MOBILE_DEFAULT_PROPS,
  getTotalDurationInFrames,
} from './data/walkthrough.mjs';

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="ProfessorTonyWebsiteWalkthrough16x9"
        component={WebsiteWalkthrough}
        width={1920}
        height={1080}
        fps={30}
        durationInFrames={getTotalDurationInFrames('desktop')}
        defaultProps={DEFAULT_PROPS}
        calculateMetadata={({props}) => ({
          durationInFrames: getTotalDurationInFrames(props.variant ?? 'desktop'),
          defaultOutName: props.outputBasename ?? DEFAULT_PROPS.outputBasename,
        })}
      />
      <Composition
        id="ProfessorTonyWebsiteWalkthrough9x16"
        component={WebsiteWalkthrough}
        width={1080}
        height={1920}
        fps={30}
        durationInFrames={getTotalDurationInFrames('mobile')}
        defaultProps={MOBILE_DEFAULT_PROPS}
        calculateMetadata={({props}) => ({
          durationInFrames: getTotalDurationInFrames(props.variant ?? 'mobile'),
          defaultOutName: props.outputBasename ?? MOBILE_DEFAULT_PROPS.outputBasename,
        })}
      />
    </>
  );
};
