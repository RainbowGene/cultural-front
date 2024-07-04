<template>
  <div>
    <Dialog
      :show="dialogConfig.show"
      :title="dialogConfig.title"
      :buttons="dialogConfig.buttons"
      :showCancel="true"
      @close="dialogConfig.show = false"
    >
      <el-form
        :model="formData"
        :rules="rules"
        ref="formDataRef"
        label-width="80px"
        @submit.prevent
      >
        <el-form-item label="栏目名称" prop="columnName">
          <el-input v-model="formData.columnName" :maxLength="10"></el-input>
        </el-form-item>
        <!-- 所属栏目 -->
        <el-form-item label="所属栏目" prop="pId">
          <ColumnSelect
            :columnId="formData.pId"
            @change="handleSelectChange"
          ></ColumnSelect>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input
            v-model="formData.sort"
            type="number"
            :maxLength="10"
          ></el-input>
        </el-form-item>
        <el-form-item label="封面类型" prop="coverType">
          <el-radio-group v-model="formData.coverType">
            <el-radio :label="0">背景颜色</el-radio>
            <el-radio :label="1">图片</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="formData.coverType == 0"
          label="背景颜色"
          prop="bgColor"
        >
          <el-color-picker v-model="formData.bgColor"></el-color-picker>
        </el-form-item>
        <el-form-item
          v-if="formData.coverType == 1"
          label="栏目封面"
          prop="iconPath"
        >
          <!-- 分类图片在服务端为 0 -->
          <CoverUpload v-model="formData.iconPath" :type="0"></CoverUpload>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-radio-group v-model="formData.type">
            <el-radio :label="0">普通栏目</el-radio>
            <el-radio :label="1">广告页栏目</el-radio>
            <el-radio :label="2">友链栏目</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="formData.type == 2"
          label="链接地址"
          prop="columnUrl"
        >
          <el-radio-group v-model="formData.columnUrl">
            <el-input v-model="formData.columnUrl" :maxLength="50"></el-input>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, nextTick } from "vue";
const { proxy } = getCurrentInstance();

const api = {
  saveColumn: "/content/saveColumn",
};

const dialogConfig = ref({
  show: false,
  title: "新增栏目",
  buttons: [
    {
      type: "primary",
      text: "确定",
      click: (e) => {
        submitForm();
      },
    },
  ],
});

const formData = ref({});
const formDataRef = ref();
const rules = {
  columnName: [{ required: true, message: "请输入栏目名" }],
  type: [{ required: true, message: "请选择类型" }],
  colorType: [{ required: true, message: "封面类型" }],
  iconPath: [{ required: true, message: "请上传封面" }],
  bgColor: [{ required: true, message: "请选择背景颜色" }],
};

const showEdit = (data) => {
  dialogConfig.value.show = true;
  nextTick(() => {
    formDataRef.value.resetFields();
    if (data.columnId == null) {
      dialogConfig.value.title = "新增栏目";
      formData.value = {};
    } else {
      dialogConfig.value.title = "修改栏目";
      if (data.bgColor != null && data.bgColor != "") {
        data.coverType = 0;
      } else if (data.iconPath != null && data.iconPath != "") {
        data.coverType = 1;
      }
      formData.value = Object.assign({}, data);
      formData.value.iconPath = { imageUrl: data.iconPath };
    }
  });
};

defineExpose({
  showEdit,
});

const emit = defineEmits(["reload"]);
const submitForm = async () => {
  formDataRef.value.validate(async (valid) => {
    if (!valid) {
      return;
    }
    let params = {};
    Object.assign(params, formData.value);
    delete params.children;
    if (params.coverType == 0) {
      params.iconPath = "";
    } else {
      params.bgColor = "";
    }
    params.cover = formData.value.iconPath;
    params.status = 1; // 栏目状态为 启动
    delete params.iconPath;
    let result = await proxy.Request({
      url: api.saveColumn,
      params,
    });
    if (!result) {
      return;
    }
    dialogConfig.value.show = false;
    proxy.Message.success("保存成功!");
    emit("reload");
  });
};

// 栏目选择器
const handleSelectChange = (e) => {
  formData.value.pId = e[e.length - 1];
};
</script>

<style lang="scss" scoped>
.check-span-item {
  float: left;
  margin-right: 10px;
  line-height: 20px;
}
</style>
