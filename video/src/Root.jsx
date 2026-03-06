import {Composition} from 'remotion';

import {WebsiteWalkthrough} from './compositions/WebsiteWalkthrough.jsx';
import {
  DEFAULT_PROPS,
  getTotalDurationInFrames,
} from './data/walkthrough.mjs';

export const RemotionRoot = () => {
  return (
    <Composition
      id="ProfessorTonyWebsiteWalkthrough16x9"
      component={WebsiteWalkthrough}
      width={1920}
      height={1080}
      fps={30}
      durationInFrames={getTotalDurationInFrames()}
      defaultProps={DEFAULT_PROPS}
      calculateMetadata={({props}) => ({
        durationInFrames: getTotalDurationInFrames(),
        defaultOutName: props.outputBasename ?? DEFAULT_PROPS.outputBasename,
      })}
    />
  );
};
