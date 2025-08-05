<template>
  <div class="schedule-container">
    <h1>培训安排</h1>
    <div class="schedule-filter">
      <div class="filter-item">
        <label>月份:</label>
        <select v-model="selectedMonth">
          <option v-for="month in months" :key="month.value" :value="month.value">
            {{ month.label }}
          </option>
        </select>
      </div>
      <div class="filter-item">
        <label>课程类型:</label>
        <select v-model="selectedType">
          <option value="">全部</option>
          <option value="技术">技术</option>
          <option value="管理">管理</option>
          <option value="软技能">软技能</option>
        </select>
      </div>
    </div>

    <div class="schedule-table">
      <table>
        <thead>
          <tr>
            <th>日期</th>
            <th>时间</th>
            <th>课程名称</th>
            <th>类型</th>
            <th>讲师</th>
            <th>地点</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in filteredSchedule" :key="index">
            <td>{{ item.date }}</td>
            <td>{{ item.time }}</td>
            <td>{{ item.courseName }}</td>
            <td>{{ item.type }}</td>
            <td>{{ item.instructor }}</td>
            <td>{{ item.location }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'

export default defineComponent({
  name: 'TrainingSchedule',
  setup() {
    const selectedMonth = ref('6')
    const selectedType = ref('')

    const months = ref([
      { value: '6', label: '6月' },
      { value: '7', label: '7月' },
      { value: '8', label: '8月' },
      { value: '9', label: '9月' }
    ])

    const scheduleData = ref([
      {
        date: '2023-06-05',
        time: '09:00-12:00',
        courseName: '前端开发基础',
        type: '技术',
        instructor: '张老师',
        location: '培训室A'
      },
      {
        date: '2023-06-12',
        time: '14:00-17:00',
        courseName: 'Vue.js进阶',
        type: '技术',
        instructor: '李老师',
        location: '培训室B'
      },
      {
        date: '2023-06-20',
        time: '09:00-12:00',
        courseName: '项目管理基础',
        type: '管理',
        instructor: '王老师',
        location: '培训室C'
      },
      {
        date: '2023-07-03',
        time: '09:00-12:00',
        courseName: '沟通技巧',
        type: '软技能',
        instructor: '赵老师',
        location: '培训室A'
      },
      {
        date: '2023-07-10',
        time: '14:00-17:00',
        courseName: '后端开发入门',
        type: '技术',
        instructor: '钱老师',
        location: '培训室B'
      }
    ])

    const filteredSchedule = computed(() => {
      return scheduleData.value.filter(item => {
        const monthMatch = item.date.split('-')[1] === selectedMonth.value
        const typeMatch = selectedType.value === '' || item.type === selectedType.value
        return monthMatch && typeMatch
      })
    })

    return {
      selectedMonth,
      selectedType,
      months,
      filteredSchedule
    }
  }
})
</script>

<style scoped>
.schedule-container {
  max-width: 1200px;
  margin: 0 auto;
}

.schedule-filter {
  display: flex;
  gap: 20px;
  margin: 20px 0;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-item select {
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.schedule-table {
  margin-top: 20px;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12
px 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

thead tr {
  background-color: #f8f9fa;
}

tbody tr:hover {
  background-color: #f1f1f1;
}
</style>
