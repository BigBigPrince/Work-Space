<template>
  <div class="courses-container">
    <h1>课程列表</h1>
    <div class="course-list">
      <div v-for="course in courses" :key="course.id" class="course-item">
        <h3>{{ course.title }}</h3>
        <p>{{ course.description }}</p>
        <div class="course-info">
          <span>讲师: {{ course.instructor }}</span>
          <span>时长: {{ course.duration }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'TrainingCourses',
  setup() {
    const courses = ref([
      {
        id: 1,
        title: '前端开发基础',
        description: '学习HTML、CSS和JavaScript的基础知识',
        instructor: '张老师',
        duration: '20小时'
      },
      {
        id: 2,
        title: 'Vue.js进阶',
        description: '深入学习Vue.js框架的高级特性和最佳实践',
        instructor: '李老师',
        duration: '15小时'
      },
      {
        id: 3,
        title: '后端开发入门',
        description: '学习Node.js和Express框架的基础知识',
        instructor: '王老师',
        duration: '25小时'
      }
    ])

    return {
      courses
    }
  }
})
</script>

<style scoped>
.courses-container {
  max-width: 1200px;
  margin: 0 auto;
}

.course-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.course-item {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.course-info {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
  color: #666;
  font-size: 14px;
}
</style>
