<template>
  <div id="signup">
    <SignupForm/>
  </div>
</template>

<script>
import SignupForm from '@/components/SignupForm.vue';

export default({
    name : 'Signup',
    components : {
        SignupForm
    }
})

</script>