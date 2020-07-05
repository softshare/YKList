<template>
    <div class="listborder">
        This is demo yklist component.
    </div>
</template>
<script>
    export default {
        props: ['sourceCodeLink'],
        methods: {
            openMyGithub() {
                const a = document.createElement('a')
                a.target = '_blank'
                a.href = 'https://github.com/ssthouse'
                a.click()
            },
            toMainPage() {
                this.$emit('to-main-page')
                console.log(123);
            }
        }
    }
</script>
<style scoped>
    .listborder {
        font-size: 18px;
    }

    a {
        color: black;
    }
</style>
