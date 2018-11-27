<template>
  <nav 
    id="nav" 
    class="navbar is-dark" 
    role="navigation" 
    aria-label="main navigation">
    <div class="navbar-brand">
      <router-link 
        to="/" 
        class="navbar-item">
        <img 
          src="~/assets/emil.svg"
          width="150" 
          height="50">
      </router-link>
      <a 
        :class="{ 'is-active': showNav }" 
        role="button" 
        class="navbar-burger burger" 
        @click="showNav = !showNav">
        <span aria-hidden="true"/>
        <span aria-hidden="true"/>
        <span aria-hidden="true"/>
      </a>
    </div>
    <div 
      id="navbarToggle" 
      :class="{ 'is-active': showNav }" 
      class="navbar-menu">
      <div class="navbar-start">
        <p class="navbar-item">
          <nuxt-link 
            to="/add/symptom" 
            class="button is-info">+ Symptom</nuxt-link>
        </p>
        <p class="navbar-item">
          <nuxt-link 
            class="button is-info" 
            to="/add/wirkstoff">+ Wirkstoff</nuxt-link>
        </p>        
        <p class="navbar-item">
          <nuxt-link 
            class="button is-info" 
            to="/add/prozess">+ Prozess im Körper</nuxt-link>
        </p>  
        <p class="navbar-item">
          <nuxt-link 
            class="button is-info" 
            to="/add/wirkstofftyp">+ Wirkstofftyp</nuxt-link>
        </p> 
        <p class="navbar-item">
          <nuxt-link 
            class="button is-info" 
            to="/add/artikel">+ Artikel</nuxt-link>
        </p> 
        <p class="navbar-item">
          <nuxt-link 
            class="button is-info" 
            to="/add/autor">+ Autor</nuxt-link>
        </p> 

        <div class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link">
            Danger Zone
          </a>

          <div class="navbar-dropdown">
            <a class="navbar-item">
              <nuxt-link to="/defaults/symptom">symptom</nuxt-link>
            </a>
            <a class="navbar-item">
              <nuxt-link to="/defaults/wirkstoff">wirkstoff</nuxt-link>
            </a>
            <a class="navbar-item">
              <nuxt-link to="/defaults/prozess">prozess</nuxt-link>
            </a>
            <a class="navbar-item">
              <nuxt-link to="/defaults/wirkstofftyp">wirkstofftyp</nuxt-link>
            </a>
            <a class="navbar-item">
              <nuxt-link to="/defaults/artikel">artikel</nuxt-link>
            </a>
            <a class="navbar-item">
              <nuxt-link to="/defaults/autor">autor</nuxt-link>
            </a>
          </div>
        </div>
        <div class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link">
            Edit Content
          </a>

          <div class="navbar-dropdown">
            <a class="navbar-item">
              <nuxt-link to="/list/symptom">symptom</nuxt-link>
            </a>
            <a class="navbar-item">
              <nuxt-link to="/list/wirkstoff">wirkstoff</nuxt-link>
            </a>
            <a class="navbar-item">
              <nuxt-link to="/list/prozess">prozess</nuxt-link>
            </a>
            <a class="navbar-item">
              <nuxt-link to="/list/wirkstofftyp">wirkstofftyp</nuxt-link>
            </a>
            <a class="navbar-item">
              <nuxt-link to="/list/artikel">artikel</nuxt-link>
            </a>
            <a class="navbar-item">
              <nuxt-link to="/list/autor">autor</nuxt-link>
            </a>
          </div>
        </div>       
      </div>
    </div> 
  </nav>
</template>

<script>
export default {
  name: 'Navbar',
  props: {
    collections: {
      type: Array,
      default: () => {
        return null
      }
    }
  },
  data() {
    return {
      showNav: false
    }
  }
}
</script>
