<script lang="ts" setup>
import { ref, Ref, watch, onMounted } from 'vue'

const mobile_nav_visible: Ref<boolean> = ref(false)
const mobile_version_active: Ref<boolean> = ref(false)
const windowHeight = ref(window.innerWidth)


watch(windowHeight, (n, o) => {
  console.log(n, o)
})

function checkIfMobile() {
  if (window.innerWidth > 750) {
    console.log('desktop version')
    mobile_version_active.value = false
    mobile_nav_visible.value = false
  } else if (window.innerWidth <= 750) {
    console.log('mobile version')
    mobile_version_active.value = true
  }
}


onMounted(() => {
  checkIfMobile()
  window.addEventListener('resize', () => {
    checkIfMobile()
  })
})
const display_modes = {
  dark:
    `--base: #000; 
      --anti_base: #fff; 
      --box_shadows: #bcbcbc; 
      --box_shadows_dark: #bbb;
      --top_nav_bg:#333;
      --button_color_light: ${mobile_version_active ? '#ffffffea' : '#fff'};
      --button_color_dark:${mobile_version_active ? '#ddddddea' : '#ddd'} ;
      --button_bg: ${mobile_version_active ? '#f9f9f9ea' : '#f9f9f9'};
      --small_nav_bg: #ddddddea;`,
  light:
    `--base: #fff; 
      --anti_base: #111;
      --box_shadows: #050505;
      --box_shadows_dark: #000; 
      --top_nav_bg:#444;
      --button_color_light: ${mobile_version_active ? '#000000ea' : '#000'};
      --button_color_dark: ${mobile_version_active ? '#222222ea' : '#222'};
      --button_bg: ${mobile_version_active ? '#090909ea' : '#090909'};
      --small_nav_bg: #000000ea;`
}


function switch_display_mode() {
  display_mode.value = display_mode.value == 'LightMode' ? 'DarkMode' : 'LightMode'
  localStorage.display_mode = display_mode.value
  set_display_mode(display_mode.value)
}

const display_mode = ref(localStorage.display_mode ?? 'DarkMode')
const display_values = ref('')
function set_display_mode(mode: string) {
  display_values.value = mode == 'LightMode' ? display_modes.light : display_modes.dark
  document.getElementById('app')?.setAttribute('style', display_values.value)
}
onMounted(() => {
  set_display_mode(display_mode.value)
})
</script>

<template>
  <button
    class="mobile_nav_toggle"
    :class="mobile_nav_visible ? 'open' : 'closed'"
    @click="mobile_nav_visible = !mobile_nav_visible"
  >
    <span class="sr-only">Menu</span>
  </button>
  <button
    id="light_dark_button"
    @click="switch_display_mode"
    v-if="!mobile_version_active"
  >{{ display_mode }}</button>
  <div
    id="nav"
    :class="mobile_version_active ? 'mobile ' + (mobile_nav_visible ? 'mobile_version_visible' : 'mobile_version_invisible') : ''"
  >
    <router-link to="/" class="logo_container">
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

    <ul class="nav_links" style="--link_amount: 4;">
      <li class="nav_link_container" style="--link_nr: 0;">
        <router-link
          class="router_link"
          to="/"
          @click="mobile_nav_visible = !mobile_nav_visible"
        >Home</router-link>
      </li>
      <li class="nav_link_container" style="--link_nr: 1;">
        <router-link
          class="router_link"
          to="/login"
          @click="mobile_nav_visible = !mobile_nav_visible"
        >Login / Registrieren</router-link>
      </li>
      <li class="nav_link_container" style="--link_nr: 2;">
        <router-link
          class="router_link"
          to="/selection"
          @click="mobile_nav_visible = !mobile_nav_visible"
        >Auswahl</router-link>
      </li>
      <li class="nav_link_container" style="--link_nr: 3;">
        <router-link
          class="router_link"
          to="/userprofile"
          @click="mobile_nav_visible = !mobile_nav_visible"
        >Profil</router-link>
      </li>
    </ul>
    <button
      id="light_dark_button"
      :class="mobile_version_active ? 'mobile' : ''"
      @click="switch_display_mode"
      v-if="mobile_version_active"
    >{{ display_mode }}</button>
  </div>
</template>

<style scoped>
#nav {
  position: fixed;
  top: 0;
  height: var(--nav_height);
  background: var(--anti_base);
  width: 100%;
  display: grid;
  grid-template-columns: 5rem calc(100% - 5.5rem);
  z-index: 100;
  transition: color 1s, background 1s, height 0s, transform 0s, top 0s, left 0s,
    margin 0s;
}

#nav * {
  font-size: 1.5rem;
  text-decoration: none;
  font-weight: 900;
}
.mobile_nav_toggle {
  display: none;
}
.nav_links {
  height: 100%;
  width: auto;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
li {
  list-style-type: none;
}
.nav_link_container {
  overflow: hidden;
  min-height: 3rem;
  display: flex;
}
.logo_container {
  margin-top: 0.5rem;
}
.sr-only {
  width: 1px;
  height: 1px;
  position: absolute;
  margin: -1px;
  border: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
}

#light_dark_button {
  position: absolute;
  font-size: 1.2rem;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 30px;
  color: var(--base);
  background: var(--button_bg);
  box-shadow: -5px -5px 20px var(--button_color_light),
    5px 5px 10px var(--button_color_dark),
    inset -2px -2px 5px var(--button_color_light),
    inset 2px 2px 5px var(--button_color_dark);
  transition: all 1s;
  bottom: 1.5rem;
  right: 1.5rem;
  /* opacity: 0.7; */
  z-index: 20;
}
#light_dark_button:hover {
  cursor: pointer;
}
@media (max-width: 750px) {
  #nav {
    display: block;
    inset: 0 0 0 100%;
    max-width: 80%;
    padding: min(25vh, 10rem) 2rem 0 2rem;
    backdrop-filter: blur(0.34rem);
    background: var(--small_nav_bg);
  }
  #nav.mobile {
    transition: all 1s, transform 0.6s ease-out;
  }
  #nav.mobile_version_invisible {
    transform: translateX(0%);
  }
  #nav.mobile_version_visible {
    transform: translateX(-100%);
  }
  .nav_links {
    position: relative;
    flex-direction: column;
    justify-content: right;
    align-items: baseline;
    gap: var(--gap, 1.5rem);
    overflow: auto;
    padding-bottom: 2rem;
  }
  .logo_container {
    position: absolute;
    top: 0.5rem;
    left: calc(50% - 2.75rem / 2);
  }
  #logosvg {
    height: 2.75rem;
  }
  .nav_link_container {
    width: 100%;
    transition: all 1s, transform 0.65s ease-in-out;
    transition-delay: calc(0.1s * var(--link_nr));
  }
  #nav.mobile_version_visible > .nav_links > .nav_link_container {
    transform: translateX(0%);
  }
  #nav.mobile_version_invisible > .nav_links > .nav_link_container {
    transform: translateX(50%);
  }
  .router_link {
    width: 100%;
    text-align: center;
  }
  .mobile_nav_toggle {
    display: block;
    z-index: 9999;
    position: absolute;
    top: 1rem;
    right: 1rem;
    width: 1.75rem;
    aspect-ratio: 1;
    border: none;
    outline: none;
    cursor: pointer;
  }
  .mobile_nav_toggle.closed {
    background: linear-gradient(
      to bottom,
      var(--base) 0% 15%,
      transparent 0% 42.5%,
      var(--base) 0% 57.5%,
      transparent 0% 85%,
      var(--base) 0% 100%
    );
  }
  .mobile_nav_toggle.open {
    background: linear-gradient(
        45deg,
        transparent 0% 45%,
        var(--base) 0% 55%,
        transparent 0% 100%
      ),
      linear-gradient(
        135deg,
        transparent 0% 45%,
        var(--base) 0% 55%,
        transparent 0% 100%
      );
  }

  #light_dark_button {
    font-size: 1.4rem;
    padding: 1rem 2rem;
    border-radius: 20px;
    bottom:1.5rem;
    right: 2rem;
    z-index: 20;
  }
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