<template>
    <div>
        <el-space>
            <el-tag v-for="(task, index) in tasks" :key="index" closable @close="tasks.splice(index, 1)" @click="">
                {{ task.name }}
            </el-tag>
        </el-space>
    </div>
</template>
<script setup>
import { ref, defineProps } from 'vue';
// const props = 
defineProps(['tasks']);
</script>
<style lang="scss" scoped></style>