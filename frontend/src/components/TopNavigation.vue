<!-- <script setup lang="ts">
import { defineProps } from 'vue'

export interface Properties {
    specific_style?: string
}

const props = defineProps<Properties>();
</script> -->

<template>
  <router-link to="/">
    <svg
      xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
      xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:svg="http://www.w3.org/2000/svg"
      viewBox="0 0 210 230"
      version="1.1"
      id="logosvg"
    >
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" id="perc_0_gradient_file_icon" />
          <stop offset="100%" id="perc_100_gradient_file_icon" />
        </linearGradient>
      </defs>
      <path
        id="text1706"
        d="m 115.52258,0.66770052 c -10.91027,0 -21.269246,1.30789178 -31.076234,3.92333478 -9.684402,2.6154462 -18.14291,6.5952927 -25.375565,11.9398967 -7.110065,5.23089 -12.810365,11.883204 -17.100923,19.956968 -4.16797,7.960051 -6.251765,17.228146 -6.251765,27.803645 0,9.210907 1.471044,17.113919 4.413141,23.709381 2.942095,6.595473 6.742481,12.338234 11.400799,17.227984 4.780907,4.77603 10.174556,8.92646 16.181335,12.45161 6.006781,3.41146 12.197612,6.48176 18.572153,9.21091 6.374543,2.72915 12.564824,5.34495 18.571599,7.84668 6.00679,2.38801 11.33931,5.00328 15.99764,7.84615 4.78091,2.72916 8.6424,5.91335 11.58449,9.55223 2.9421,3.52515 4.41314,7.78947 4.41314,12.79293 0,4.32117 -0.85774,8.24432 -2.57397,11.76949 -1.71622,3.52516 -4.22944,6.48157 -7.53929,8.86959 -3.18727,2.38802 -7.10987,4.26431 -11.7682,5.62889 -4.65831,1.25086 -9.92974,1.87646 -15.813926,1.87646 -8.948877,0 -16.855748,-0.91006 -23.720639,-2.7295 -6.742302,-1.93315 -12.565377,-4.0367 -17.46887,-6.31099 -4.903492,-2.27431 -8.992522,-4.25696 -12.136137,-6.14061 -2.906548,-1.7416 -5.438422,-4.49515 -10.954092,2.98815 -5.129308,6.95911 -36.0040477,24.19494 -33.8413087,37.27062 1.3261563,8.01782 67.1278777,9.21157 74.9520527,9.20738 8.086208,0.55362 46.52203,0.39801 57.18713,-2.55859 10.66509,-2.95659 19.98136,-7.33478 27.94954,-13.13424 7.96817,-5.91317 14.28177,-13.24778 18.9401,-22.00384 4.6583,-8.75605 6.9871,-18.93369 6.9871,-30.53262 0,-8.86977 -1.47105,-16.54552 -4.41314,-23.02726 -2.9421,-6.59548 -6.8036,-12.28105 -11.5845,-17.05708 -4.78091,-4.88973 -10.23567,-9.04016 -16.36504,-12.45162 -6.12935,-3.52515 -12.3813,-6.652665 -18.75585,-9.381805 -6.37454,-2.729166 -12.62648,-5.287746 -18.75584,-7.675771 -6.12937,-2.501725 -11.64579,-5.116991 -16.54928,-7.846146 -4.780904,-2.842876 -8.642401,-6.02706 -11.584494,-9.552237 -2.819509,-3.638877 -4.229443,-7.90317 -4.229443,-12.79292 0,-3.297736 0.61275,-6.42472 1.838623,-9.381312 1.348461,-2.956588 3.310039,-5.458483 5.884374,-7.505355 2.696919,-2.160585 6.006773,-3.80962 9.92958,-4.94677 3.92278,-1.250866 8.51979,-1.875953 13.79104,-1.875953 6.74232,0 12.93315,0.795663 18.57217,2.387672 5.639,1.478294 10.60379,3.184015 14.89434,5.11717 4.29057,1.81944 7.44785,4.940889 10.84861,5.117172 12.27688,0.636394 54.69026,-41.905371 46.01142,-47.3875649 0,0 -85.42285,-0.20212958 -91.06187,-0.20212958 z"
        sodipodi:nodetypes="scccssccscccssccscssssccsscsscccscccscccsccscs"
      />
    </svg>
  </router-link>
  <div id="nav">
    <router-link class="router_link" to="/">Home</router-link>
    <router-link class="router_link" to="/login">Login / Registrieren</router-link>
    <router-link class="router_link" to="/selection">Auswahl</router-link>
    <router-link class="router_link" to="/userprofile">Profil</router-link>
  </div>
  
</template>

<style scoped>

#nav {
  position: fixed;
  top: 0;
  height: var(--nav_height);
  width: 70vw;
  display: flex;
  justify-content: space-around;
  align-items: center;
  left: 15vw;
}
#nav * {
  font-size: 1.5rem;
  text-decoration: none;
  font-weight: 900;
}
.router_link {
  padding: 0.5rem 1.5rem;
  color: var(--base);
  position: relative;
  overflow: hidden;
  transform-origin: left;
  transition: color 0.2s;
  outline: none;
}
.router_link::before {
  content: "";
  background: var(--top_nav_bg);
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  transform-origin: left;
  transform: translateX(calc(-100% + 0.5rem));
  z-index: -1;
  transition: transform 0.2s ease-in-out, border-radius 0.2s;
}
.router_link:hover {
  color: var(--anti_base);
}
.router_link:hover::before {
  transform: translateX(0);
}
.router-link-active {
  color: var(--anti_base);
}
.router-link-active::before {
  border-radius: 5px;
  background: var(--base);
  transform: translateX(0);
}
#logosvg {
  position: fixed;
  top: 0.5rem;
  left: 0.5rem;
  fill: url("#gradient");
  width: 3.5rem;
  max-height: calc(var(--nav_height) - 0.5rem);
}
#perc_0_gradient_file_icon {
  stop-color: var(--base);
  stop-opacity: 1;
}
#perc_100_gradient_file_icon {
  stop-color: var(--base);
  stop-opacity: 1;
}
#logopath {
  height: 1rem;
}
</style>