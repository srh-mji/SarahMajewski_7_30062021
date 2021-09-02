<template>
  <div id="post">
    <EditPost/>
  </div>
</template>

<script>
import EditPost from '@/components/EditPost.vue';

export default({
    name : 'Post',
    components : {
        EditPost
    }
})

</script>