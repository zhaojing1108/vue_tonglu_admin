<template>
  <el-dialog :append-to-body="true" :visible.sync="dialog" :title="isAdd ? '新增' : '编辑'" width="500px" :close-on-click-modal="false">
    <el-form ref="form" :model="form" size="small" label-width="80px">
      <el-form-item label="图片地址">
        <el-input v-model="form.imgAddress" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="图片排序">
        <el-input v-model="form.sortNum" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="图片描述">
        <el-input v-model="form.description" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="是否使用">
        <!-- <el-input v-model="form.isuse" style="width: 370px;"/> -->
        <el-select v-model="value" placeholder="请选择" @change="selectUse">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      </el-form-item>
      <el-form-item label="图片别名">
        <el-input v-model="form.name" style="width: 370px;"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/banner'
export default {
  props: {
    isAdd: {
      type: Boolean,
      required: true
    },
    sup_this: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      loading: false, dialog: false,
      form: {
        id: '',
        imgAddress: '',
        sortNum: '',
        description: '',
        isuse: '',
        name: ''
      },
      options: [{
          value: '1',
          label: '是'
        }, {
          value: '2',
          label: '否'
        }],
        value: ''
    }
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.loading = true
      if (this.isAdd) {
        this.doAdd()
      } else this.doEdit()
    },
    doAdd() {
      add(this.form).then(res => {
        this.resetForm()
        this.$notify({
          title: '添加成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        this.$parent.$parent.init()
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    doEdit() {
      edit(this.form).then(res => {
        this.resetForm()
        this.$notify({
          title: '修改成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        this.sup_this.init()
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.form = {
        id: '',
        imgAddress: '',
        sortNum: '',
        description: '',
        isuse: '',
        name: ''
      }
    },
    selectUse(vID){
      let obj;
      // let isuse;
      // let form;
      obj = this.options.find((item)=>{
        return item.value=== vID;                   
      }); 
      this.form.isuse = obj.value;
      // console.log(this.form.isuse)
    }
  }
}
</script>

<style scoped>

</style>
