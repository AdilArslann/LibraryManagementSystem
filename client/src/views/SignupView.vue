<script lang="ts" setup>
import { signup, createLibrarian } from '@/stores/user'
import type { SchoolSignUp } from '@mono/server/src/shared/entities'
import { trpc } from '@/trpc'
import { ref, onBeforeMount, computed } from 'vue'
import PageForm from '@/components/PageForm.vue'
import { FwbAlert, FwbButton, FwbInput } from 'flowbite-vue'
import { DEFAULT_SERVER_ERROR } from '@/consts'
import AlertError from '@/components/AlertError.vue'
import { useNavigationStore } from '@/stores/navigationStore'
// import useErrorMessage from '@/composables/useErrorMessage'

const schools = ref<SchoolSignUp[]>([])
let isDropdownOpen = ref(false)
const searchQuery = ref('')
const navigationStore = useNavigationStore()

const userForm = ref({
  email: '',
  password: '',
  name: '',
  schoolId: 0,
})

const isCreateLibrarian = () => {
  return navigationStore.currentRouteName === 'CreateLibrarian'
}

const hasSucceeded = ref(false)

// Wrap our signup call in a try/catch block to catch any errors.
// Set the error message if there is an error.
const errorMessage = ref('')
async function submitSignup() {
  try {
    if (userForm.value.schoolId === 0) {
      throw new Error('Please select a school')
    }
    // if the route is CreateLibrarian use another trpc route and if it is SignUp use another trpc route
    if (isCreateLibrarian()) {
      await createLibrarian(userForm.value)
    } else {
      await signup(userForm.value)
    }


    // clear error
    errorMessage.value = ''

    // display success message
    hasSucceeded.value = true
  } catch (error) {
    // set error, which will be automatically displayed
    errorMessage.value = error instanceof Error ? error.message : DEFAULT_SERVER_ERROR
  }
}




const selectSchool = (school: SchoolSignUp) => {
  userForm.value.schoolId = school.id
  searchQuery.value = school.name
  isDropdownOpen.value = false
}


const filteredSchools = computed(() => {
  return schools.value.filter(school =>
    school.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

onBeforeMount(async () => {
  schools.value = await trpc.school.get.query()
})

// Or, if we move the generic error handling to a separate composable
// function, which creates an error message ref for us and handles
// the try/catch block, we can simplify our submitSignup function to:
// const [submitSignup, errorMessage] = useErrorMessage(async () => {
//   await signup(userForm.value)

//   hasSucceeded.value = true
// })
</script>

<template>
  <PageForm heading="Sign Up" formLabel="Signup" @submit="submitSignup">
    <template #default>
      <FwbInput label="Email" type="email" v-model="userForm.email" :required="true" />

      <FwbInput label="Password" id="password" name="password" type="password" autocomplete="current-password"
        v-model="userForm.password" :required="true" />

      <FwbInput label="Name" v-model="userForm.name" :required="true" />

      <div class="relative">
        <FwbInput label="Select School" v-model="searchQuery" :required="true" @input="isDropdownOpen = true" />
        <div v-if="isDropdownOpen && searchQuery"
          class="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded shadow">
          <div v-for="school in filteredSchools" :key="school.id" class="p-2 hover:bg-gray-100 cursor-pointer"
            @click="selectSchool(school)">
            <strong>{{ school.name }}</strong><br>
            {{ school.address }}
          </div>
        </div>
      </div>


      <FwbAlert v-if="hasSucceeded" data-testid="successMessage" type="success">
        You have successfully signed up! You can now log in.
        <RouterLink :to="{ name: 'Login' }" class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">Go to
          the login page</RouterLink>
      </FwbAlert>
      <AlertError :message="errorMessage">
        {{ errorMessage }}
      </AlertError>

      <div class="grid">
        <FwbButton color="default" type="submit" size="xl">Sign up</FwbButton>
      </div>
    </template>

    <template #footer>
      <FwbAlert class="bg-transparent text-center">
        Already a member?
        {{ ' ' }}
        <RouterLink :to="{ name: 'Login' }" class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">Log in
        </RouterLink>
      </FwbAlert>
    </template>
  </PageForm>
</template>