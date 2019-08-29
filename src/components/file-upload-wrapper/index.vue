<template>
    <div @click="openFinder">
        <label class="hidden-file-input" tabindex="-1" style="">upload
            <input ref="file" @change="fileChange" type="file" accept="image/jpg,image/jpeg,image/png, image/gif" class="dll-upload">
        </label>
        <slot>
        </slot>
    </div>
</template>

<script>
    export default {
        ready() {
        },
        props: {},
        mounted(){
        },
        methods: {
            openFinder() {
                let vm = this;
                vm.$refs.file.click();
            },
            fileChange(e) {
                let vm = this;
                let files = e.target.files || e.dataTransfer.files;
                if (files && files.length > 0) {
                    vm.$emit('on-file-change', files[0])
                    e.target.value=null;
                }
            }
        },
        data() {
            return {}
        },
        computed: {}
    }
</script>

<style lang="scss" scoped>
@import "./style";
</style>