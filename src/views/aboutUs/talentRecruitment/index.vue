<template>
  <div class="app-container">
    <router-link :to="'/aboutUs/talentRecruitment/create'"><el-button type="primary" size="small" style="margin-bottom:15px">添加职位</el-button></router-link>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" border style="width: 100%;">
      <el-table-column prop="id" label="id"/>
      <el-table-column prop="updateTime" label="发布时间">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updateTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="positionName" label="职位名称"/>
      <el-table-column prop="address" label="地址"/>
      <el-table-column prop="categories" label="职位类别"/>
      <el-table-column prop="content" label="内容"/>
      <el-table-column label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <router-link :to="{path:'/aboutUs/talentRecruitment/edit',query:{id:scope.row.id}}" :sup_this="sup_this" >  
            <el-button type="primary" size="small">
             	 编辑
            </el-button>
          </router-link>
          <el-popover
            v-if="checkPermission(['ADMIN'])"
            :ref="scope.row.id"
            placement="top"
            width="180">
            <p>确定删除本条数据吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
              <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.row.id)">确定</el-button>
            </div>
            <el-button slot="reference" type="danger" size="mini">删除</el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <el-pagination
      :total="total"
      style="margin-top: 8px;"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"/>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import { del } from '@/api/talentRecruitment'
import { parseTime } from '@/utils/index'
export default {
  mixins: [initData],
  data() {
    return {
      delLoading: false, 
      sup_this: this
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    parseTime,
    checkPermission,
    beforeInit() {
      this.url = 'api/talentRecruitment'
      const sort = 'id,desc'
      this.params = { page: this.page, size: this.size, sort: sort }
      const query = this.query
      const type = query.type
      const value = query.value
      if (type && value) { this.params[type] = value }
      return true
    },
    subDelete(id) {
      this.delLoading = true
      del(id).then(res => {
        this.delLoading = false
        this.$refs[id].doClose()
        this.init()
        this.$notify({
          title: '删除成功',
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        this.delLoading = false
        this.$refs[id].doClose()
        
      })
    }
  }
}
</script>

<style scoped>

</style>
