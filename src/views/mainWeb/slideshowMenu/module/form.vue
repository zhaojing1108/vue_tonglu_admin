<template>
  <el-dialog :append-to-body="true" :visible.sync="dialog" :title="isAdd ? '新增' : '编辑'" width="500px" :close-on-click-modal="false">
    <el-form ref="form" :model="form"  :rules="rules" size="small" label-width="80px">
      <el-form-item label="菜单排序" prop="sortNum">
        <el-input v-model.number="form.sortNum" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="菜单标题" prop="titile">
        <el-input v-model="form.titile" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="简介描述" prop="description">
        <el-input v-model="form.description" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="对应图标" prop="imgUrl">
        <el-input v-model="form.imgUrl" style="width: 370px;"/>
      </el-form-item>     
      <el-form-item label="创建时间" prop="createTime">
        <!-- <el-input v-model="form.createTime" style="width: 370px;"/> -->
        <el-date-picker
          v-model="form.createTime"
          type="date"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit('form')">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/bannerMenu'
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
        titile: '',
        description: '',
        imgUrl: '',
        sortNum: '',
        createTime: ''
      },
      pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
      },
      rules:{
        titile:[{required:true,message:"请输入菜单标题",trigger:"blur"}],
        description:[{required:true,message:"请输入菜单描述",trigger:"blur"}],
        imgUrl:[{required:true,message:"请输入菜单图标",trigger:'blur'}],
        sortNum:[
          {required:true,message:"请输入菜单排序",trigger:"blur"},
          {type:'number',message:"排序必须为数值"}
        ],
        createTime:[{type:'date',required:true,message:"请选择创建时间",trigger:"change"}]
      }
    }
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    doSubmit(formName) {
      this.$refs[formName].validate((valid)=>{
        if(valid){
          this.loading = true;
          if(this.isAdd){
            this.doAdd()
          }else{this.doEdit();}
        }
      })
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
        titile: '',
        description: '',
        imgUrl: '',
        sortNum: '',
        createTime: ''
      }
    },
    selectDate(el){

    }
  }
}
</script>

<style scoped>

</style>
