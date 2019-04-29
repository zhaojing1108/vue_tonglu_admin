<template>
  <div>
    <router-link :to="'/example/create/'"><el-button type="primary" size="small" style="margin:10px 15px 5px">添加文章</el-button></router-link>
    <el-table v-loading="loading" :data="data" size="small" border style="width: 98%;margin:10px auto;" >
      <el-table-column prop="id" label="id" width="40px"/>
      <el-table-column prop="title" label="标题"/>
      <el-table-column prop="url" label="文章链接"/>
      <el-table-column prop="imgUrl" label="文章主图"/>
      <el-table-column prop="imgUrl" label="文章主图"/>

      <el-table-column prop="category" label="所属分类" 
      column-key="category"
      :filters="tableStatus" 
      :filter-method="handleFilterChange" >
        <template slot-scope="scope">          
          <span v-if="scope.row.category == 1"> 热门活动</span>  
          <span v-else-if="scope.row.category == 2">景区新闻</span>
          <span v-else-if="scope.row.category == 3">旅游新闻</span>
        </template>
      </el-table-column>
      
      <el-table-column prop="author" label="文章作者"/>
      <!-- <el-table-column prop="content" label="文章内容"/> -->
      <el-table-column prop="description" label="在首页上的简介"/>
      <el-table-column prop="isShow" label="主页上显示"/>
      <el-table-column label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <router-link :to="'/example/edit/'+scope.row.id" :data="scope.row" :sup_this="sup_this">
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
    <div style="margin-top: 20px;margin-left:20px" >
      <el-button type="danger" @click="delGroup" :disabled="this.sels.length === 0">批量删除</el-button><!--disabled值动态显示，默认为true,当选中复选框后值为false-->
    </div>
    <!--分页组件-->
    <el-pagination
      :total="total"
      style="width: 98%;margin:10px auto;"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"/>
  </div>
</template>


<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import { parseTime } from '@/utils/index'
import { del } from '@/api/activityInformation'
import { fetchList } from '@/api/article'
export default {
  mixins: [initData],
  data() {
    return {
      delLoading: false, 
      sup_this: this,
      sels:[],
      scope:'',
      tableStatus: 
      [
        { text: '景区新闻', value: '1' },
        { text: '热门活动', value: '2' },
        { text: '旅游活动', value: '3' }
      ],
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
      this.url = 'api/activityInformation'
      const sort = 'id,desc'
      this.params = { page: this.page, size: this.size, sort: sort }
      const query = this.query
      const type = query.type
      console.log
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
        console.log(err.response.data.message)
      })
    },
    // 批量删除
    selsChange(sels) { 
      this.sels = sels 
    }, 
    delGroup() { 
      var ids = this.sels.map(item => item.id).join()//获取所有选中行的id组成的字符串，以逗号分隔 
      console.log(ids)
      this.delLoading = true
      del(ids).then(res => {
        this.delLoading = false
        this.init()
        this.$notify({
          title: '删除成功',
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        this.delLoading = false
        console.log(err.response.data.message)
      })
    }, 
    handleFilterChange(filters) {
      console.log(filters)
      // const property = column['property'];
      // return row[property] === value;
    },
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
