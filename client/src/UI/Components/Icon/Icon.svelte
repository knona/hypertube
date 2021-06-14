<script lang="ts">
  import { IconType } from './Models/IconType';
  import SearchIcon from '../../../Resources/Images/SearchIcon.svg';
  import PlayIcon from '../../../Resources/Images/PlayIcon.svg';
  import MailIcon from '../../../Resources/Images/MailIcon.svg';
  import UserIcon from '../../../Resources/Images/UserIcon.svg';
  import UserFillIcon from '../../../Resources/Images/UserSolidCircleIcon.svg';
  import KeyIcon from '../../../Resources/Images/KeyIcon.svg';
  import CameraIcon from '../../../Resources/Images/CameraIcon.svg';
  import ChevronRightIcon from '../../../Resources/Images/ChevronRightIcon.svg';
  import ChevronDownIcon from '../../../Resources/Images/ChevronDownIcon.svg';
  import CloseIcon from '../../../Resources/Images/CloseIcon.svg';
  import GoogleIcon from '../../../Resources/Images/GoogleIcon.svg';
  import FTIcon from '../../../Resources/Images/FTIcon.svg';
  import VolumeUp from '../../../Resources/Images/VolumeUp.svg';
  import VolumeOff from '../../../Resources/Images/VolumeOff.svg';
  import Fullscreen from '../../../Resources/Images/Fullscreen.svg';
  import Subtitles from '../../../Resources/Images/Subtitles.svg';
  import Pause from '../../../Resources/Images/Pause.svg';
  import ForwardIcon from '../../../Resources/Images/ForwardIcon.svg';
  import BackwardIcon from '../../../Resources/Images/BackwardIcon.svg';
  import HeartIcon from '../../../Resources/Images/HeartIcon.svg';
  import Checkmark from '../../../Resources/Images/CheckmarkIcon.svg';
  import StandByIcon from '../../../Resources/Images/StandByIcon.svg';

  export let type: IconType;
</script>

{#if type === IconType.search}
  <SearchIcon />
{:else if type === IconType.play}
  <PlayIcon />
{:else if type === IconType.email}
  <MailIcon />
{:else if type === IconType.user}
  <UserIcon />
{:else if type === IconType.userFill}
  <UserFillIcon />
{:else if type === IconType.key}
  <KeyIcon />
{:else if type === IconType.camera}
  <CameraIcon />
{:else if type === IconType.chevronDown}
  <ChevronDownIcon />
{:else if type === IconType.chevronRight}
  <ChevronRightIcon />
{:else if type === IconType.close}
  <CloseIcon />
{:else if type === IconType.ft}
  <FTIcon />
{:else if type === IconType.google}
  <GoogleIcon />
{:else if type === IconType.volumeUp}
  <VolumeUp />
{:else if type === IconType.volumeOff}
  <VolumeOff />
{:else if type === IconType.fullscreen}
  <Fullscreen />
{:else if type === IconType.subtitles}
  <Subtitles />
{:else if type === IconType.pause}
  <Pause />
{:else if type === IconType.forward}
  <ForwardIcon />
{:else if type === IconType.backward}
  <BackwardIcon />
{:else if type === IconType.heart}
  <HeartIcon />
{:else if type === IconType.checkmark}
  <Checkmark />
{:else if type === IconType.StandBy}
  <StandByIcon />
{/if}
