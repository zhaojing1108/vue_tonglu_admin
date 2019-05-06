<template>
  <div class="app-container conta">
    <div class="wap">
      <eHeader :query="query" class="fl" />
      <el-button  class="bt" type="primary"  size="mini" :loading="delLoading" @click="delGroup()" :disabled="this.sels.length === 0">批量删除</el-button>
    </div>
    <!--表格渲染-->
    <el-table 
    :data="data" 
    :fit="true"
    @row-click="handleCurrentChange" 
    @selection-change="selsChange" 
    ref="table"
    v-loading="loading" >
      <el-table-column 
      type="selection" 
      width="55"  
      prop="uuid"
      :reserve-selection="true">
      </el-table-column>
      <el-table-column prop="id" label="id"/>
      <el-table-column prop="sortNum" label="图片排序"  />
      <el-table-column prop="imgAddress" label="图片地址"/>
      <el-table-column prop="description" label="图片描述"/>
      <el-table-column  label="是否使用">
        <template slot-scope="scope">
          <span v-if="scope.row.isuse == 1">是</span>  
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="图片别名"/>

      <el-table-column label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <edit v-if="checkPermission(['ADMIN'])" :data="scope.row" :sup_this="sup_this"/>
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
import { del } from '@/api/banner'
import { dels } from '@/api/banner'
import eHeader from './module/header'
import edit from './module/edit'
export default {
  components: { eHeader, edit },
  mixins: [initData],
  data() {
    return {
      delLoading: false, 
      sup_this: this,
      sels:[],
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    checkPermission,
    beforeInit() {
      this.url = 'api/banner'
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
        console.log(err.response.data.message)
      })
    },
    // 批量删除
    selsChange(sels) { 
      this.sels = sels 
    },      
    delGroup() { 
      var ids = JSON.stringify(this.sels.map(item => item.id))
      console.log(ids)
      this.delLoading = true
      this.init()
      dels(ids).then(res => {
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
    handleCurrentChange(val) { 
      this.table = val
    } 
  }
}
</script>

<style >

</style>
